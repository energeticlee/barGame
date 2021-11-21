const express = require(`express`);
const app = express();
const server = require(`http`).Server(app);
const io = require(`socket.io`)(server);
const cors = require(`cors`);
const path = require(`path`);
// const { v4: uuidV4 } = require(`uuid`);
const InBetween = require("./GameLogic/inBetween");
const {
  getRoomName,
  removePlayerId,
  isHost,
  getRoomKey,
  allPlayerReady,
  isTurn,
  removePlayerRequest,
  userValidation,
  getPlayerIndex,
  allBoughtIn,
  getInBetweenState,
  allMinBuyin,
} = require("./GameLogic/helper");

const PORT = 5050;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, `public`)));

//* REQUIRE CONTROLLER | EXPRESS ROUTING
const games = require("./controllers/games");

//* ROUTES
app.use("/api/games", games);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client", "index.html"));
});

//* Setup collection => on === event listener
const GAME_DATA = {};
io.on(`connection`, (socket) => {
  //* Game Data { roomName, pw?, gameRules? { hostName, playerInfo, score } }

  socket.emit(`personalId`, socket.id);

  //* HOST CREATE ROOM (DONE)
  socket.on("create-room", ({ roomName, host, password }, cb) => {
    //* Check if GAME_DATA key.includes roomname
    console.log("GAME_DATA", GAME_DATA);

    if (getRoomName(GAME_DATA, roomName)) {
      //* Room Exist
      cb({ status: false, msg: "Room Taken" });
    } else {
      //* Room Does Not Exist
      socket.join(roomName);
      const roomKey = getRoomKey(io, roomName);
      GAME_DATA[roomKey] = {
        host,
        password,
        playerStatus: [
          { username: host.hostName, userId: host.hostId, readyState: true },
        ],
      };
      cb({ status: true });
    }
  });

  //* GET ALL PLAYERS (DONE)
  socket.on("get-players", (roomName, cb) => {
    const rmName = getRoomName(GAME_DATA, roomName);
    if (!GAME_DATA[rmName]) cb({ status: false, msg: "Room Does Not Exist" });
    else {
      //* SEND REQUIRED DATA ONLY (Remove socketId)
      const { playerStatus } = GAME_DATA[rmName];
      const data = removePlayerId(playerStatus);
      cb({
        status: true,
        data,
      });
    }
  });

  //* GET ALL PLAYERS (DONE)
  socket.on("is-host", ({ roomName, userId }, cb) => {
    if (!GAME_DATA[getRoomName(GAME_DATA, roomName)])
      //* ROOM DON'T NOT EXIST
      cb({ status: false, msg: "Room Does Not Exist" });
    //* ROOM EXIST
    else {
      const roomKey = getRoomKey(io, roomName);
      if (isHost(GAME_DATA[roomKey], userId))
        //* IS HOST
        cb({
          status: true,
          isHost: true,
        });
      //* NOT HOST
      else cb({ status: false, isHost: false });
    }
  });

  //* PLAYER JOIN ROOM (DONE)
  socket.on(`join-room`, ({ roomName, password }, { username, userId }, cb) => {
    if (getRoomName(GAME_DATA, roomName)) {
      //* ROOM EXIST
      const roomKey = getRoomKey(io, roomName);
      //* CHECK IF PASSWORD REQUIRED
      if (
        !GAME_DATA[roomKey].password ||
        GAME_DATA[roomKey].password === password
      ) {
        //* PASSWORD MATCH || NO PASSWORD REQUIRED
        socket.join(roomName);
        GAME_DATA[roomKey].playerStatus.push({
          username,
          userId,
          readyState: false,
        });
        cb({ status: true });
        const data = removePlayerId(GAME_DATA[roomKey].playerStatus);
        socket.to(roomName).emit("new-join", data);
      }
      //* INCORRECT PASSWORD
      else cb({ status: false, msg: "Invalid Password" });
    } else cb({ status: false, msg: "Invalid Room" });
  });

  //* UPDATE CHANGE GAME (DONE)
  socket.on("change-setting", ({ gInfo, roomName, userId }, cb) => {
    const roomKey = getRoomKey(io, roomName);
    if (!isHost(GAME_DATA[roomKey], userId))
      return cb({ status: false, msg: "No Authorisation" });

    GAME_DATA[roomKey].selectedGameInfo = {
      ...GAME_DATA[roomKey].selectedGameInfo,
      ...gInfo,
    };
    io.in(roomName).emit("update-game", GAME_DATA[roomKey].selectedGameInfo);
  });

  //* PLAYER SET READY (DONE)
  socket.on("update-ready", ({ username, userId }, roomName, ready, cb) => {
    const roomKey = getRoomKey(io, roomName);
    if (GAME_DATA[roomKey]) {
      const { playerStatus } = GAME_DATA[roomKey];
      if (!userValidation(playerStatus, username, userId))
        return cb({ status: false, msg: "No Authorisation" });

      const playerIndex = getPlayerIndex(playerStatus, username);
      playerStatus[playerIndex].readyState = ready;
      const data = removePlayerId(playerStatus);
      io.in(roomName).emit("update-player-status", data);
    } else cb({ status: false, msg: "Invalid Room" });
  });

  //* HOST INITIALISE GAME START (DONE)
  socket.on("initialise-game", ({ username, userId }, roomName, cb) => {
    const roomKey = getRoomKey(io, roomName);
    const roomInfo = GAME_DATA[roomKey];
    if (!roomInfo.selectedGameInfo)
      return cb({ status: false, msg: "Require Game Setting Input" });
    else if (!roomInfo.selectedGameInfo.selectedGame)
      return cb({ status: false, msg: "Please Select Game" });
    else if (!isHost(roomInfo, userId))
      return cb({ status: false, msg: "No Authorisation" });
    //* CHECK ALL USER BUYIN
    const { selectedGameInfo, playerStatus } = roomInfo;

    //* Check min buyin requirement met before initialisation

    //* validate incoming data & all player ready
    if (allPlayerReady(playerStatus)) {
      const { selectedGame } = selectedGameInfo;
      switch (selectedGame) {
        case "inBetween":
          const { stake, minBuyin } = selectedGameInfo;
          if (!stake || !minBuyin)
            return cb({
              status: false,
              msg: "Require Both Stake & Min Buyin Input",
            });
          if (stake > minBuyin)
            return cb({
              status: false,
              msg: "Stake cannot be higher than min buyin",
            });
          if (!allBoughtIn(playerStatus))
            return cb({
              status: false,
              msg: "Not all players are bought in",
            });
          if (allMinBuyin(playerStatus, minBuyin))
            return cb({
              status: false,
              msg: "Min buyin requirement not met",
            });
          GAME_DATA[roomKey] = {
            ...GAME_DATA[roomKey],
            gameState: new InBetween(playerStatus, selectedGameInfo),
          };

          GAME_DATA[roomKey].gameState.issueTwoCards();
          GAME_DATA[roomKey].gameState.anteUp();
          const { issuedCards, turn, pot } = GAME_DATA[roomKey].gameState;
          const data = removePlayerId(
            GAME_DATA[roomKey].gameState.playerStatus
          );
          io.in(roomName).emit("start-inbetween", roomName, {
            issuedCards,
            turn,
            playerStatus: data,
            stake,
            minBuyin,
            pot,
          });
          break;

        default:
          return cb({ status: false, msg: "Invalid Request" }); //* INVALID INPUT
      }
    }
    return cb({ status: false, msg: "Invalid Request" });
  });

  //* TOPUP-REQUEST (DONE)
  socket.on(
    "topup-request",
    ({ username, userId }, { roomName }, topUpValue, cb) => {
      const roomKey = getRoomKey(io, roomName);
      const { playerStatus, host } = GAME_DATA[roomKey];

      //* Check is request is from host
      if (GAME_DATA[roomKey].host.hostId === userId) {
        const targetIndex = getPlayerIndex(playerStatus, username);
        GAME_DATA[roomKey].playerStatus[targetIndex].buyin = topUpValue;
        const data = removePlayerId(playerStatus);
        io.in(roomName).emit("update-stack", data, GAME_DATA[roomKey].pending);
        return;
      }
      //* USER VALIDATION
      if (!userValidation(playerStatus, username, userId))
        return cb({ status: false, msg: "No Authorisation" });
      //* Amount pending

      GAME_DATA[roomKey].pending = GAME_DATA[roomKey].pending
        ? [
            ...GAME_DATA[roomKey].pending,
            { reqUsername: username, pending: topUpValue },
          ]
        : [{ reqUsername: username, pending: topUpValue }];

      //* SEND ARRAY OF REQUEST TO HOST
      socket
        .to(host.hostId)
        .emit("topup-request-host", GAME_DATA[roomKey].pending);
    }
  );

  //* TOPUP-CONFIRM (DONE)
  socket.on(
    "topup-confirm",
    ({ userId }, { roomName }, { reqUsername, pending }, cb) => {
      //* Validate is host
      const roomKey = getRoomKey(io, roomName);
      const { playerStatus } = GAME_DATA[roomKey];
      if (!isHost(GAME_DATA[roomKey], userId))
        return cb({ status: false, msg: "No Authorisation" });

      GAME_DATA[roomKey].pending = removePlayerRequest(
        GAME_DATA[roomKey].pending,
        reqUsername
      );
      //* Pass playerStatus
      const targetIndex = getPlayerIndex(playerStatus, reqUsername);
      GAME_DATA[roomKey].playerStatus[targetIndex].buyin = pending;
      const data = removePlayerId(playerStatus);
      io.in(roomName).emit("update-stack", data, GAME_DATA[roomKey].pending);
    }
  );

  //* IN-GAME CONFIRM (DONE)
  socket.on(
    "rebuy-confirm",
    ({ userId }, { roomName }, { reqUsername, pending }, cb) => {
      //* Validate is host
      const roomKey = getRoomKey(io, roomName);
      const { playerStatus } = GAME_DATA[roomKey];
      if (!isHost(GAME_DATA[roomKey], userId))
        return cb({ status: false, msg: "No Authorisation" });

      GAME_DATA[roomKey].pending = removePlayerRequest(
        GAME_DATA[roomKey].pending,
        reqUsername
      );
      //* Pass playerStatus
      const targetIndex = getPlayerIndex(playerStatus, reqUsername);
      GAME_DATA[roomKey].gameState.playerStatus[targetIndex].topup(pending);
      const data = getInBetweenState(GAME_DATA[roomKey].gameState);
      io.in(roomName).emit(
        "update-ingame-stack",
        data,
        GAME_DATA[roomKey].pending
      );
    }
  );
  //* TOPUP-REJECT (DONE)
  socket.on(
    "topup-reject",
    ({ userId }, { roomName }, { reqUsername, pending }, cb) => {
      //* Validate is host
      const roomKey = getRoomKey(io, roomName);
      const { playerStatus } = GAME_DATA[roomKey];
      if (!isHost(GAME_DATA[roomKey], userId))
        return cb({ status: false, msg: "No Authorisation" });

      GAME_DATA[roomKey].pending = removePlayerRequest(
        GAME_DATA[roomKey].pending,
        reqUsername
      );
      //* Pass playerStatus
      const data = removePlayerId(playerStatus);
      io.in(roomName).emit("update-stack", data, GAME_DATA[roomKey].pending);
    }
  );

  //* HIT (DONE)
  socket.on("hit", ({ username }, { roomName }, bet, cb) => {
    const roomKey = getRoomKey(io, roomName);
    const {
      gameState: { turn },
    } = GAME_DATA[roomKey];
    //* Validate Action
    if (!isTurn(GAME_DATA[roomKey].gameState, username))
      return cb({ status: false, msg: "Please Wait For Your Turn" });

    //* Check if bet is within pot size
    if (GAME_DATA[roomKey].gameState.pot < bet)
      return cb({ status: false, msg: "You can't bet more than the pot" });
    //* Check if bet is half of stack
    if (GAME_DATA[roomKey].gameState.playerStatus[turn].stack < bet * 2)
      return cb({
        status: false,
        msg: "You can only bet up to half your stack",
      });

    const middleCard = GAME_DATA[roomKey].gameState.attemptBetween();
    const outcome = GAME_DATA[roomKey].gameState.outcome();
    //* Player win, transfer bet size from pot to player stack
    if (outcome === "win") {
      GAME_DATA[roomKey].gameState.pot -= bet;
      GAME_DATA[roomKey].gameState.playerStatus[turn].stack += bet;
    } else if (outcome === "lose") {
      GAME_DATA[roomKey].gameState.pot += bet;
      GAME_DATA[roomKey].gameState.playerStatus[turn].stack -= bet;
    } else {
      GAME_DATA[roomKey].gameState.pot += bet * 2;
      GAME_DATA[roomKey].gameState.playerStatus[turn].stack -= bet * 2;
    }

    GAME_DATA[roomKey].gameState.anteUp();

    const data = getInBetweenState(GAME_DATA[roomKey].gameState);
    io.in(roomName).emit("hit-outcome", data, middleCard);
  });

  //* PASS (DONE)
  socket.on("pass", ({ username }, { roomName }, cb) => {
    const roomKey = getRoomKey(io, roomName);
    const {
      gameState: { turn },
    } = GAME_DATA[roomKey];
    //* Validate Action
    if (!isTurn(GAME_DATA[roomKey].gameState, username))
      return cb({ status: false, msg: "Please Wait For Your Turn" });

    GAME_DATA[roomKey].gameState.passTurn();
    GAME_DATA[roomKey].gameState.issueTwoCards();

    const data = getInBetweenState(GAME_DATA[roomKey].gameState);
    io.in(roomName).emit("next-player", data);
  });

  //! LEAVE-GAME => CASHOUT (NOT DONE)

  //! HANDLE DISCONNECTED USER (NOT DONE)
  //! kill all on disconnect? (NOT DONE)
  socket.on(`disconnect`, () => {
    socket.broadcast.emit(`gameEnded`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});

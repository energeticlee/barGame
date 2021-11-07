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
  getRoomId,
  getRoomKey,
  allPlayerReady,
  validPlayer,
  getPlayerIndex,
  allBoughtIn,
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

  //! No io.to() => Don't need socket.id
  // socket.emit(`personalId`, socket.id);

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
        playerStatus: [{ username: host, readyState: true }],
      };
      cb({ status: true });
    }
  });

  //* GET ALL PLAYERS (DONE)
  socket.on("get-players", (roomName, cb) => {
    if (!GAME_DATA[getRoomName(GAME_DATA, roomName)])
      cb({ status: false, msg: "Room Does Not Exist" });
    else
      cb({
        status: true,
        data: GAME_DATA[getRoomName(GAME_DATA, roomName)]?.playerStatus,
      });
  });

  //* GET ALL PLAYERS (DONE)
  socket.on("is-host", ({ roomName, username }, cb) => {
    if (!GAME_DATA[getRoomName(GAME_DATA, roomName)])
      //* ROOM DON'T NOT EXIST
      cb({ status: false, msg: "Room Does Not Exist" });
    //* ROOM EXIST
    else {
      const roomKey = getRoomKey(io, roomName);
      if (GAME_DATA[roomKey].host === username)
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
  socket.on(`join-room`, ({ roomName, password }, { username }, cb) => {
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
        GAME_DATA[roomKey].playerStatus.push({ username, readyState: false });
        cb({ status: true });
        socket.to(roomName).emit("new-join", GAME_DATA[roomKey].playerStatus);
      }
      //* INCORRECT PASSWORD
      else cb({ status: false, msg: "Invalid Password" });
    } else cb({ status: false, msg: "Invalid Room" });
  });

  //* UPDATE CHANGE GAME (DONE)
  socket.on("change-setting", ({ gInfo, roomName }) => {
    const roomKey = getRoomKey(io, roomName);

    GAME_DATA[roomKey].selectedGameInfo = {
      ...GAME_DATA[roomKey].selectedGameInfo,
      ...gInfo,
    };
    io.in(roomName).emit("update-game", GAME_DATA[roomKey].selectedGameInfo);
  });

  //* PLAYER SET READY (DONE)
  socket.on("update-ready", (username, roomName, ready, cb) => {
    const roomKey = getRoomKey(io, roomName);
    if (GAME_DATA[roomKey]) {
      const { playerStatus } = GAME_DATA[roomKey];
      const playerIndex = getPlayerIndex(playerStatus, username);
      playerStatus[playerIndex].readyState = ready;
      io.in(roomName).emit("update-player-status", playerStatus);
    } else cb({ status: false, msg: "Invalid Room" });
  });

  //* PLAYER SET BUYIN (DONE)
  socket.on("lobby-buyin", ({ username }, { roomName }, buyinValue, cb) => {
    const roomKey = getRoomKey(io, roomName);
    const { playerStatus } = GAME_DATA[roomKey];
    //* CHECK ROOM IS VALID
    if (!roomKey)
      return cb({ status: false, msg: "Invalid Input", redirect: true });
    //* CHECK INPUT IS VALID
    if (!+buyinValue) return cb({ status: false, msg: "Invalid Input" });
    //* CHECK USERNAME IS VALID
    if (!validPlayer(playerStatus, username))
      return cb({ status: false, msg: "Invalid User" });

    //* SET BUYIN TO USERINFO
    const playerIndex = getPlayerIndex(playerStatus, username);
    playerStatus[playerIndex] = {
      ...playerStatus[playerIndex],
      buyin: buyinValue,
    };
    io.in(roomName).emit("update-lobby-buyin", playerStatus);
  });

  //* HOST INITIALISE GAME START (DONE)
  socket.on("initialise-game", ({ username }, roomName, cb) => {
    const roomKey = getRoomKey(io, roomName);
    const roomInfo = GAME_DATA[roomKey];
    if (!roomInfo.selectedGameInfo)
      return cb({ status: false, msg: "Require Game Setting Input" });
    else if (!roomInfo.selectedGameInfo.selectedGame)
      return cb({ status: false, msg: "Please Select Game" });
    //* CHECK ALL USER BUYIN
    const { host, selectedGameInfo, playerStatus } = roomInfo;

    //* Check all players has bought in ("stack")

    //* validate incoming data & all player ready
    if (username === host && allPlayerReady(playerStatus)) {
      const { selectedGame } = selectedGameInfo;
      switch (selectedGame) {
        case "inBetween":
          const { stake, minBuyin } = selectedGameInfo;
          if (!stake || !minBuyin)
            return cb({
              status: false,
              msg: "Require Both Stake & Min Buyin Input",
            });
          if (!allBoughtIn(playerStatus))
            return cb({
              status: false,
              msg: "Not all players are bought in",
            });
          GAME_DATA[roomKey] = {
            ...GAME_DATA[roomKey],
            gameState: new InBetween(playerStatus, selectedGameInfo),
          };

          GAME_DATA[roomKey].gameState.issueTwoCards();
          const { issuedCards, turn, pot } = GAME_DATA[roomKey].gameState;

          io.in(roomName).emit("start-inbetween", roomName, {
            issuedCards,
            turn,
            playerStatus,
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

  //! Require userId and HostId
  //! TOPUP-REQUEST (NOT DONE)
  socket.on(
    "topup-request",
    ({ username, userId }, { hostId }, topUpValue, cb) => {
      //* send request to host, require host socket id
      socket.to(hostId).emit("topup-request-host", { username, topUpValue });
    }
  );
  //! TOPUP-CONFRIM (NOT DONE)
  socket.on(
    "topup-confirm",
    ({ username, userId }, { roomName }, topUpValue, cb) => {
      //* Update GAME_DATA
      //* Pass playerStatus
      io.of("roomId").emit("update-stack", "");
    }
  );
  //? HIT (VALIDATE PLAYER & TURN => HIT & UPDATE)
  //? PASS (VALIDATE PLAYER & TURN => HIT & UPDATE)
  //? LEAVE-GAME => CASHOUT

  //? kill all on disconnect? (NOT DONE)
  socket.on(`disconnect`, () => {
    socket.broadcast.emit(`callEnded`);
  });

  //* (NOT DONE)
  socket.on(`answerCall`, (data) => {
    io.to(data.to).emit(`callAccepted`, data.signal);
  });
});

server.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});

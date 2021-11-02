const express = require(`express`);
const app = express();
const server = require(`http`).Server(app);
const io = require(`socket.io`)(server);
const cors = require(`cors`);
const path = require(`path`);
// const { v4: uuidV4 } = require(`uuid`);
const InBetween = require("./GameLogic/inBetween").default;
const initialiseGame = require("./GameLogic/initialiseGame").default;
const { getRoomName, getRoomId } = require("./GameLogic/helper");

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
      //* Room Does Not Exist (socket.join(roomName) ???)
      socket.join(roomName);
      const roomKey = `${
        [...io.sockets.adapter.rooms.get(roomName)][0]
      }$${roomName}`;
      GAME_DATA[roomKey] = {
        host,
        password,
        playerStatus: [{ username: host, readyState: true }],
      };
      cb({ status: true, data: GAME_DATA[roomKey].playerStatus });
    }
  });

  //* GET ALL PLAYERS (DONE)
  socket.on("get-players", (roomName, cb) => {
    console.log(GAME_DATA[getRoomName(GAME_DATA, roomName)]?.playerStatus);
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
      const roomKey = `${
        [...io.sockets.adapter.rooms.get(roomName)][0]
      }$${roomName}`;
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

  //* PLAYER JOIN ROOM (NOT DONE)
  socket.on(`join-room`, ({ roomName, password }, { username }, cb) => {
    if (getRoomName(GAME_DATA, roomName)) {
      //* ROOM EXIST
      socket.join(roomName);
      const roomKey = `${
        [...io.sockets.adapter.rooms.get(roomName)][0]
      }$${roomName}`;
      //* CHECK IF PASSWORD REQUIRED
      if (
        !GAME_DATA[roomKey].password ||
        GAME_DATA[roomKey].password === password
      ) {
        //* PASSWORD MATCH || NO PASSWORD REQUIRED
        GAME_DATA[roomKey].playerStatus.push({ username, readyState: false });
        cb({ status: true });
        socket
          .to(getRoomId(GAME_DATA, roomName))
          .emit("new-join", GAME_DATA[roomKey].playerStatus);
      }
      //* INCORRECT PASSWORD
      else cb({ status: false, msg: "Invalid Password" });
    } else cb({ status: false, msg: "Invalid Room" });
  });

  //* PLAYER SET READY (DONE)
  socket.on("set-ready", ({ username, readyState }, roomName, cb) => {
    if (GAME_DATA[roomName]) {
      const playerStatus = GAME_DATA[roomName].playerStatus;
      //* UPDATE USER
      const targetIndex = playerStatus.findIndex(
        (p) => p.username === username
      );
      playerStatus.splice(targetIndex, 1, {
        username,
        readyState: !readyState,
      });

      socket.emit("player-status", playerStatus);
    } else cb({ status: false, msg: "Invalid Room" });
  });

  //* HOST CHANGE GAME (NOT DONE)
  socket.on("change-game", (selectedGame, roomName, hostName, cb) => {
    //* Validate if host send request
    if ((GAME_DATA[roomName].host = hostName))
      socket.emit("game-change", selectedGame);
    else cb(false); //* NOT A HOST
  });

  //* HOST START GAME (NOT DONE)
  socket.on(`start-game`, (data) => {
    //? Change all user component to game board
    //? How to manage player turn?
    io.to(data.userToCall).emit(`requestToJoin`, {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  //* HOST INITIALISE GAME START (NOT DONE)
  socket.on("initialise-game", (roomName, selectedGame, playersInfo, cb) => {
    switch (selectedGame) {
      case "inBetween":
        initialiseGame(GAME_DATA[roomName], playersInfo, InBetween);
        cb(true);
        break;
      default:
        return cb(false); //* INVALID INPUT
    }
  });

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

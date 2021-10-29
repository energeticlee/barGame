const express = require(`express`);
const app = express();
const server = require(`http`).Server(app);
const io = require(`socket.io`)(server);
const cors = require(`cors`);
const path = require(`path`);
// const { v4: uuidV4 } = require(`uuid`);
const InBetween = require("./GameLogic/inBetween").default;
const initialiseGame = require("./GameLogic/initialiseGame").default;

const PORT = 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, `public`)));

app.get(`/room/:room`, (req, res) => {
  //* First user create unique room name
  const roomId = req.params.room;
  res.status(200).json({ roomId });
});

//* Setup collection => on === event listener
io.on(`connection`, (socket) => {
  //* Game Data { roomName, pw?, gameRules? { hostName, playerName, score } }
  const GAME_DATA = {};

  //* On join, issue personal id
  socket.emit(`personalId`, socket.id);

  //* HOST CREATE ROOM
  socket.on("create-room", ({ roomName, username, password }) => {
    if (io.sockets.adapter.rooms[roomName]) {
      //* Room Exist
      cb(false);
    } else {
      //* Room Does Not Exist (socket.join(roomName) ???)
      socket.join(roomName);
      GAME_DATA[roomName] = { host: username, password };
      cb(true);
    }
  });

  //* PLAYER JOIN ROOM
  socket.on(`join-room`, (roomName, playerName, cb) => {
    if (io.sockets.adapter.rooms[roomName]) {
      //* Room exist
      socket.join(roomName);
      GAME_DATA[roomName] = {
        ...GAME_DATA[roomName],
        player: [...GAME_DATA[roomName].player, playerName],
      };
      cb(true);
    } else cb(false); //* INVALID ROOM
  });

  //* On host game change
  socket.on("change-game", (selectedGame, roomName, hostName, cb) => {
    //* Validate if host send request
    if ((GAME_DATA[roomName].host = hostName))
      socket.emit("game-change", selectedGame);
    else cb(false); //* NOT A HOST
  });

  //* HOST INITIALISE GAME START
  socket.on("initialise-game", (roomName, selectedGame, cb) => {
    switch (selectedGame) {
      case "inBetween":
        initialiseGame(GAME_DATA, roomName, InBetween);
        cb(true);
        break;
      default:
        return cb(false); //* INVALID INPUT
    }
  });

  //* Only host can start game
  socket.on(`start-game`, (data) => {
    //? Change all user component to game board
    //? How to manage player turn?
    io.to(data.userToCall).emit(`requestToJoin`, {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  //? kill all on disconnect?
  socket.on(`disconnect`, () => {
    socket.broadcast.emit(`callEnded`);
  });

  //*
  socket.on(`answerCall`, (data) => {
    io.to(data.to).emit(`callAccepted`, data.signal);
  });
});

server.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});

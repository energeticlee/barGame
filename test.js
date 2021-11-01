const roomId = "12";
const GAME_DATA = {
  "JLJ5Lk3EjpA5AYRcAABe/123": {
    host: "aa",
    password: undefined,
    playerStatus: [[Object]],
  },
};

const roomExist = (gameData, roomName) => {
  const getRoomId = (str, roomName) => {
    const room = str.split("/");
    return room[1] === roomName;
  };

  const result = Object.keys(gameData).find((keys) => {
    console.log(getRoomId(keys, roomName));
    return getRoomId(keys, roomName);
  });
  return result; //* Return roomkey
};

console.log(roomExist(GAME_DATA, roomId));

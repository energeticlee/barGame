const getRoomName = (gData, rName) =>
  Object.keys(gData).find((key) => key.split("$%$")[1] === rName); //* Return roomkey

const getRoomId = (gData, rName) => {
  const target = Object.keys(gData).find(
    (key) => key.split("$%$")[1] === rName
  ); //* Return roomkey
  return target.split("$%$")[0];
};

const getRoomKey = (io, rName) =>
  `${[...io.sockets.adapter.rooms.get(rName)][0]}$%$${rName}`;

const allPlayerReady = (playerStatus) =>
  Object.values(playerStatus).filter(
    (playerState) => playerState.readyState === false
  ).length === 0;

module.exports = { getRoomName, getRoomId, getRoomKey, allPlayerReady };

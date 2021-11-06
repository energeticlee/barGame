const getRoomName = (gData, rName) =>
  Object.keys(gData).find((key) => key.split("$%$")[1] === rName); //* Return roomkey

const getRoomId = (gData, rName) => {
  const target = Object.keys(gData).find(
    (key) => key.split("$%$")[1] === rName
  ); //* Return roomkey
  return target.split("$%$")[0];
};

const getRoomKey = (io, rName) => {
  if (io.sockets.adapter.rooms.get(rName))
    return `${[...io.sockets.adapter.rooms.get(rName)][0]}$%$${rName}`;
  else return false;
};

const allPlayerReady = (playerStatus) =>
  Object.values(playerStatus).filter(
    (playerState) => playerState.readyState === false
  ).length === 0;

const validPlayer = (playerStatus, username) =>
  Object.values(playerStatus).filter(
    (playerState) => playerState.username === username
  ).length === 1;

const getPlayerIndex = (playerStatus, username) =>
  playerStatus.findIndex((p) => p.username === username);

module.exports = {
  getRoomName,
  getRoomId,
  getRoomKey,
  allPlayerReady,
  validPlayer,
  getPlayerIndex,
};

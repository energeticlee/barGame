const getRoomName = (gData, rName) =>
  Object.keys(gData).find((key) => key.split("$%$")[1] === rName); //* Return roomkey

const getRoomKey = (io, rName) => {
  if (io.sockets.adapter.rooms.get(rName))
    return `${[...io.sockets.adapter.rooms.get(rName)][0]}$%$${rName}`;
  else return false;
};

const removePlayerId = (playerStatus) =>
  playerStatus.map((user) => {
    const { userId, ...rest } = user;
    return rest;
  });

const removePlayerRequest = (pending, username) =>
  pending.filter((user) => {
    user.reqUsername !== username;
  });

const isHost = (gdata, id) => gdata.host.hostId === id;

const isTurn = ({ playerStatus, turn }, username) =>
  playerStatus[turn].playerName === username;

const userValidation = (playerStatus, username, id) => {
  const targetUser = playerStatus.find((user) => user.username === username);
  return targetUser?.userId === id;
};

const allPlayerReady = (playerStatus) =>
  Object.values(playerStatus).filter(
    (playerState) => playerState.readyState === false
  ).length === 0;

const validPlayer = (playerStatus, username) =>
  Object.values(playerStatus).filter(
    (playerState) => playerState.username === username
  ).length === 1;

const allBoughtIn = (playerStatus) =>
  Object.values(playerStatus).filter((playerState) => !playerState.buyin)
    .length === 0;

const allMinBuyin = (playerStatus, minBuyin) =>
  Object.values(playerStatus).filter(
    (playerState) => parseInt(playerState.buyin) < minBuyin
  ).length === 0;

const getPlayerIndex = (playerStatus, username) =>
  playerStatus.findIndex((p) => p.username === username);

const getInBetweenState = (gameState) => {
  const { issuedCards, turn, playerStatus, stake, minBuyin, pot } = gameState;
  const playerData = playerStatus.map(({ playerName, stack }) => {
    return { playerName, stack };
  });

  return { issuedCards, turn, playerStatus: playerData, stake, minBuyin, pot };
};

module.exports = {
  getRoomName,
  getRoomKey,
  removePlayerId,
  isHost,
  userValidation,
  allPlayerReady,
  validPlayer,
  getPlayerIndex,
  allBoughtIn,
  removePlayerRequest,
  isTurn,
  getInBetweenState,
  allMinBuyin,
};

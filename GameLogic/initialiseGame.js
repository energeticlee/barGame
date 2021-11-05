const initialiseGame = (gameRoom, playersInfo, gameFunc) => {
  gameRoom = {
    ...gameRoom,
    gamePlayData: new gameFunc(playersInfo),
  };
};

module.exports = initialiseGame;

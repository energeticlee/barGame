const initialiseGame = (gameRoom, playersInfo, gameFunc) => {
  gameRoom = {
    ...gameRoom,
    selectedGame: new gameFunc(playersInfo),
  };
};

module.exports = initialiseGame;

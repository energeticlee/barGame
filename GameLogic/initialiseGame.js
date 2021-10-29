const initialiseGame = (gameData, roomName, gameFunc) => {
  gameData[roomName] = {
    ...gameData[roomName],
    selectedGame: new gameFunc(),
  };
};

export default initialiseGame;

const getRoomName = (gData, rName) =>
  Object.keys(gData).find((key) => key.split("$")[1] === rName); //* Return roomkey

module.exports = { getRoomName };

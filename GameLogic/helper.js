const getRoomName = (gData, rName) =>
  Object.keys(gData).find((key) => key.split("$%$")[1] === rName); //* Return roomkey

const getRoomId = (gData, rName) => {
  const target = Object.keys(gData).find(
    (key) => key.split("$%$")[1] === rName
  ); //* Return roomkey
  return target.split("$%$")[0];
};

module.exports = { getRoomName, getRoomId };

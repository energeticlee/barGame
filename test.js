// const roomId = "JLJ5Lk3EjpA5AYRcAABe/123";
// const GAME_DATA = {
//   "JLJ5Lk3EjpA5AYRcAABe/123": {
//     host: "aa",
//     password: undefined,
//     playerStatus: [{ username: "p1", readyState: true }],
//   },
// };

// GAME_DATA[roomId].playerStatus.push({ username: "p2", readyState: true });

// console.log(GAME_DATA[roomId].playerStatus);

const info = [
  { username: "aa", userId: "_h8kXGhB2iTbsNFjAAAf", readyState: true },
];

const result = info.map((user) => {
  delete user.userId;
  return user;
});

console.log("result", result);

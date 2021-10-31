const express = require("express");
const router = express.Router();
const gameDatabase = require("../models/gameSchema");

router.get("/all-games", (req, res) => {
  const allGamesSeed = [
    {
      gameName: "inBetween",
      gameSetup:
        "At the start of the game, each player will contribute X amount into the pot. This will repeat whenever the pot is empty.",
      howToPlay:
        "Each player will take turn to play. On player turn, two value will be presented, if the play choose to 'hit', player have to place a wage before the middle value is reveal. If the value falls within the initial two values range, player win. If the value falls outside the intial two values range, player lose. If the value matches either of the inital values, player loses double the wage",
    },
  ];
  res.status(200).json({ data: allGamesSeed });
});

module.exports = router;

class Player {
  constructor({ username, buyin, userId }) {
    this.playerName = username;
    this.stack = parseInt(buyin);
    this.userId = userId;
  }

  cashOut = () => {
    const balance = this.stack;
    this.stack = 0;
    return balance;
  };

  topup = (value) => (this.stack += +value);
}

class InBetween {
  constructor(playersInfo, { stake, minBuyin }) {
    this.currentDeck = this.newDeck();
    this.issuedCards = [];
    this.middleCard;
    this.playerStatus = this.populatePlayers(playersInfo);
    this.pot = 0;
    this.turn = 0; //* Index of array
    this.stake = stake;
    this.minBuyin = minBuyin;
  }
  //* Player tracker: turn, players [{ playerName, stack, winnings }]

  anteUp = () => {
    if (this.pot <= 0) {
      this.playerStatus.map((player) => {
        player.stack -= this.stake;
        this.pot += this.stake;
      });
    }
    //* all players chip in ante
    //* update all player stack
    //* return ante collected
  };

  issueTwoCards = () => {
    if (this.currentDeck.length > 10) this.currentDeck = this.newDeck();
    this.middleCard = "";
    //* display 2 option with currentDeck
    const cardOne = this.drawACard();
    const cardTwo = this.drawACard();

    this.issuedCards = [cardOne, cardTwo].sort((a, b) => a - b);
  };

  attemptBetween = () => {
    //* Select 1 card from currentDeck
    this.middleCard = this.drawACard();
    //* Return true if successful, else false
    return this.middleCard;
  };

  outcome = () => {
    return (
      this.middleCard > this.issuedCards[0] &&
      this.middleCard < this.issuedCards[1]
    );
  };

  drawACard = () => {
    return this.currentDeck.splice(
      Math.floor(Math.random() * this.currentDeck.length),
      1
    )[0];
  };

  newDeck = () => {
    const result = [];
    for (let x = 1; x <= 13; x++) {
      for (let i = 1; i <= 4; i++) {
        result.push(x);
      }
    }
    return result;
  };

  populatePlayers = (players) => {
    let playerList = [];
    players.map((player) => playerList.push(new Player(player)));
    return playerList;
  };

  //* New player join mid-game
  newPlayer = (playerName, stack) => {
    this.player.push(new Player(playerName, stack));
  };

  passTurn = () => {
    if (this.playerStatus.length - 1 === this.turn) this.turn = 0;
    else this.turn++;
  };
}

module.exports = InBetween;

//* Game condition
//* Start Game = new Inbetween(playerList) { player, stack }
//* Player take turns to play (if turn, wait for player to act)

//* issueTwoCards
// on player turn, issue two cards

//* attemptBetween
// Only accessable when bet committed

//* Host leave, transfer host else random pick new host

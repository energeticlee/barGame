class Player {
  constructor({ username, buyin }) {
    this.playerName = username;
    this.stack = buyin;
    this.winnings = 0;
  }

  cashOut = () => {
    const balance = this.stack + this.winnings;
    this.stack = 0;
    this.winnings = 0;
    return balance;
  };
}

class InBetween {
  constructor(playersInfo) {
    this.currentDeck = this.newDeck();
    this.issuedCards = [];
    this.middleCard;
    this.pot;
    this.turn = 0; //* Index of array
    this.playerStatus = this.populatePlayers(playersInfo);
  }
  //* Player tracker: turn, players [{ playerName, stack, winnings }]

  issueTwoCards = () => {
    if (this.currentDeck.length > 10) this.newDeck();
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
    new Player(playerName, stack);
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

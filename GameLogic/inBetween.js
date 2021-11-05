class Player {
  constructor({ username, stack }) {
    this.playerName = username;
    this.buyin = buyin;
    this.winnings = 0;
  }
}

class InBetween {
  constructor(playersInfo) {
    this.currentDeck = this.newDeck();
    this.issuedCards = [];
    this.middleCard;
    this.pot;
    this.turn = 0; //* Index of array
    this.gameStatus = this.populatePlayers(playersInfo);
  }
  //* Player tracker: turn, players [{ playerName, buyin, winnings }]

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
    return players.forEach((player) => playerList.push(new Player(player)));
  };

  newPlayer = (playerName, buyin) => {
    new Player(playerName, buyin);
  };
}

module.exports = InBetween;

//* Game condition
//* Start Game = new Inbetween(playerList) { player, buyin }
//* Player take turns to play (if turn, wait for player to act)

//* issueTwoCards
// on player turn, issue two cards

//* attemptBetween
// Only accessable when bet committed

//* Host leave, transfer host else random pick new host

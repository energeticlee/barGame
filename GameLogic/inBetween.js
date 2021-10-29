class InBetween {
  constructor() {
    this.currentDeck = this.newDeck();
    this.issuedCards = [];
    this.middleCard;
  }

  issueTwoCards = () => {
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
}

export default InBetween;

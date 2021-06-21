class Player {
  constructor(name, socket_id) {
    this.name = name;
    this.socket_id = socket_id;
    this.answer = {};
    this.points = 0;
  }

  addPoints(point) {
    this.points += point;
    console.log('Points added to player ' + this.name);
  }

  addAnswer(round, answer) {
    this.answer[round] = answer;
    console.log('Round ' + round + ' answer given by player ' + this.name);
  }
}

module.exports = Player;

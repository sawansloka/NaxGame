var PLAYER = require('./player');

class Room {
  constructor(room_id) {
    this.room_id = room_id;
    this.players = {};
    this.dp = [
      [4, 0, 25, 0],
      [3, 1, 0, 75],
      [2, 2, -12.5, 50],
      [1, 3, -25, 25],
      [0, 4, 0, -25],
    ];
  }

  addNewPlayer(name, socket_id) {
    if (Object.keys(this.players).length >= 4) {
      console.log(
        '4 Players already added to the room ! Cannot add more players to this room !'
      );
      return;
    }
    var player = new PLAYER(name, socket_id);
    this.players[socket_id] = player;
    console.log('Player added successfully !!');
  }

  answerToRound(socket_id, round, answer) {
    var player = this.players[socket_id];
    player.addAnswer(round, answer);
  }

  calculatePoints(round) {
    var answers = [];
    for (var i of Object.keys(this.players)) {
      answers.push(this.players[i].answer[round]);
    }

    var v1 = 0,
      v2 = 0;
    for (var i of answers) {
      if (i == 1) {
        v1 += 1;
        continue;
      }
      v2 += 1;
    }

    console.log(v1, v2);

    var point1 = 0,
      point2 = 0;
    for (var item of this.dp) {
      if (item[0] == v1 && item[1] == v2) {
        console.log('Found', item);
        point1 = item[2];
        point2 = item[3];
        break;
      }
    }

    for (var i in answers) {
      if (answers[i] == 1) {
        if (round == 7 || round == 8) {
          this.players[Object.keys(this.players)[i]].addPoints(10 * point1);
        } else {
          this.players[Object.keys(this.players)[i]].addPoints(point1);
        }
        continue;
      }
      if (round == 7 || round == 8) {
        this.players[Object.keys(this.players)[i]].addPoints(10 * point2);
      } else {
        this.players[Object.keys(this.players)[i]].addPoints(point2);
      }
    }
  }
}

module.exports = Room;

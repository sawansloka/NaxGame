var ROOM = require('./room');

class Game {
  constructor() {
    this.room_map = {};
  }

  roomExists(room_id) {
    if (this.room_map[room_id] == undefined) {
      return false;
    }
    return true;
  }

  createNewRoom(room_id) {
    if (this.roomExists(room_id)) {
      console.log('Room Already exists !');
      return;
    }
    var room = new ROOM(room_id);
    this.room_map[room_id] = room;
    console.log('Room with id ' + room_id + ' created !');
  }

  addPlayerToRoom(room_id, name, socket_id) {
    if (!this.roomExists(room_id)) {
      console.log(
        'Room doesnot exists with id - ' +
          room_id +
          '. Please create a room, to add player to it !'
      );
      return;
    }
    var room = this.room_map[room_id];
    room.addNewPlayer(name, socket_id);
  }

  addAnswerToRoom(room_id, socket_id, round, answer) {
    if (!this.roomExists(room_id)) {
      console.log(
        'Room doesnot exists with id - ' + room_id + '. Please create a room !'
      );
      return;
    }
    var room = this.room_map[room_id];
    room.answerToRound(socket_id, round, answer);
  }

  calculatePoints(room_id, round) {
    if (!this.roomExists(room_id)) {
      console.log(
        'Room doesnot exists with id - ' + room_id + '. Please create a room !'
      );
      return;
    }
    var room = this.room_map[room_id];
    room.calculatePoints(round);
  }
}

module.exports = Game;

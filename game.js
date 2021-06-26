var ROOM = require('./room');

class Game {
  constructor() {
    this.room_map = {};
  }

  //checking if room id exists for further process
  roomExists(room_id) {
    if (this.room_map[room_id] == undefined) {
      return false;
    }
    return true;
  }

  //creating room id with condition
  createNewRoom(room_id) {
    if (this.roomExists(room_id)) {
      console.log('Room Already exists !');
      return;
    }
    var room = new ROOM(room_id);
    this.room_map[room_id] = room;
    console.log('Room with id ' + room_id + ' created !');
  }

  //adding player to the room with condition
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

    //calling function from room to add players
    room.addNewPlayer(name, socket_id);
  }

  //adding answer from each room, if room exists
  addAnswerToRoom(room_id, socket_id, round, answer) {
    if (!this.roomExists(room_id)) {
      console.log(
        'Room doesnot exists with id - ' + room_id + '. Please create a room !'
      );
      return;
    }
    var room = this.room_map[room_id];

    //calling function from room to add answer
    room.answerToRound(socket_id, round, answer);
  }

  //calculation of point, if room exists
  calculatePoints(room_id, round) {
    if (!this.roomExists(room_id)) {
      console.log(
        'Room doesnot exists with id - ' + room_id + '. Please create a room !'
      );
      return;
    }
    var room = this.room_map[room_id];

    //calling function from room to calculate points
    room.calculatePoints(round);
  }
}

module.exports = Game;

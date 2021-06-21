const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.set('view engine', 'ejs');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(http, {
  debug: true,
});
const port = 8000;
var GAME = require('./game');
var game = new GAME();

app.use('/peerjs', peerServer);
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', socket => {
  console.log('Connection made with', socket.id);
  socket.on('create-room', msg => {
    game.createNewRoom(msg.roomID);
    game.addPlayerToRoom(msg.roomID, msg.playerName, socket.id);
    io.to(socket.id).emit('receive-msg', 'Created room with id ' + msg.roomID);
  });

  socket.on('join-room', msg => {
    game.addPlayerToRoom(msg.roomID, msg.playerName, socket.id);
    io.to(socket.id).emit('receive-msg', 'Joined room ' + msg.roomID);
  });

  socket.on('answer-room', msg => {
    game.addAnswerToRoom(msg.roomID, socket.id, msg.round, msg.answer);
    io.to(socket.id).emit('receive-msg', 'Answered to round ' + msg.round);
  });

  socket.on('calculate-points', msg => {
    game.calculatePoints(msg.roomID, msg.round);
    console.log(game.room_map[msg.roomID].players);
    var message = { name: [], points: [] };
    for (var i of Object.keys(game.room_map[msg.roomID].players)) {
      console.log(i);
      message.name.push(game.room_map[msg.roomID].players[i].name);
      message.points.push(game.room_map[msg.roomID].players[i].points);
    }
    console.log(message);
    for (var i of Object.keys(game.room_map[msg.roomID].players)) {
      io.to(i).emit('receive-msg-from-server', message);
    }
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

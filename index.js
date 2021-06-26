const express = require('express'); //Express Framework
const app = express();
const http = require('http').Server(app); //Http Server
const io = require('socket.io')(http);
app.set('view engine', 'ejs');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(http, {
  debug: true,
});
const port = 8000;
var GAME = require('./game');
var game = new GAME();

//Middleware
app.use('/peerjs', peerServer);
app.use(express.static('public'));

//API
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

//Creating Connection between Client and Server
io.on('connection', socket => {
  console.log('Connection made with', socket.id);

  //Creating room by one participant
  socket.on('create-room', msg => {
    //Calling a function from Game to create a room
    game.createNewRoom(msg.roomID);

    //calling a function from Game to add players in the room
    game.addPlayerToRoom(msg.roomID, msg.playerName, socket.id);
    io.to(socket.id).emit('receive-msg', 'Created room with id ' + msg.roomID);
  });

  //Joining room by other participants
  socket.on('join-room', msg => {
    //calling a function from Game to add players in the room
    game.addPlayerToRoom(msg.roomID, msg.playerName, socket.id);
    io.to(socket.id).emit('receive-msg', 'Joined room ' + msg.roomID);
  });

  //Uploading Answers from each room
  socket.on('answer-room', msg => {
    //calling a function from Game to add answer from each room
    game.addAnswerToRoom(msg.roomID, socket.id, msg.round, msg.answer);
    io.to(socket.id).emit('receive-msg', 'Answered to round ' + msg.round);
  });

  //Calcuation of Points
  socket.on('calculate-points', msg => {
    //Calling a  function from Game to calculate points
    game.calculatePoints(msg.roomID, msg.round);
    console.log(game.room_map[msg.roomID].players);

    //storing name and points in message
    var message = { name: [], points: [] };
    for (var i of Object.keys(game.room_map[msg.roomID].players)) {
      console.log(i);
      message.name.push(game.room_map[msg.roomID].players[i].name);
      message.points.push(game.room_map[msg.roomID].players[i].points);
    }
    console.log(message);
    for (var i of Object.keys(game.room_map[msg.roomID].players)) {
      //sending message to client
      io.to(i).emit('receive-msg-from-server', message);
    }
  });
});

//Hosting at PORT
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

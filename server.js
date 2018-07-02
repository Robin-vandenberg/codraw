console.log('Starting node server');

const express = require('express');
const socket = require('socket.io');
const path = require('path');
const PORT = process.env.PORT || 5000;

var app = express();
var server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

var drawing = []; //stores all drawn objects

//makes sure that everything that is in public folder gets hosted on the server
app.use(express.static(path.join(__dirname, 'public')));

console.log('Node server is Running');

console.log('Starting sockets');

var io = socket(server);

console.log('Sockets active');

//when someone connects to the server with a client using sockets (which should be every client) log this to the console
io.sockets.on('connect', socket => {
  var userID = socket.id;
  console.log('New connection: ' + userID);
  io.sockets.connected[userID].emit('welcome', 'Welcome to the drawing app'); //sends welcome message to new client
  io.sockets.connected[userID].emit('drawing', drawing); //sends array of already draws object to client, to make sure he sees what other people have made

  //when a client emits a message named brush, the servers forwards this to all other clients
  socket.on('brush', data => {
    socket.broadcast.emit('brush', data);
    //If you want to skip the sending client: socket.sockets.emit('mouse', data);
    drawing.push(data); //every object that gets recieved by the server gets added to the array
    //console.log(drawing);
  });
});

//libraries imports
const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

//file imports
const generateMessage = require('../util/messageGenerator');

//declarations
const app = express();
const PORT = process.env.PORT || 3000;

//main
const PATH = path.join(__dirname, '../public');

const SERVER = http.createServer(app);
const io = socketIO(SERVER);

app.use(express.static(PATH));

io.on("connection", (socket) => {
  console.log("new connection...")

  socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (msg, cb) => {
    io.emit('newMessage', generateMessage(msg.from, msg.text));
    cb();
  });

  socket.on('disconnect', (msg) =>{
    console.log('user was disconnected');
  });

});

SERVER.listen(PORT, function(){
  console.log(`server is running on port: ${PORT}`);
})

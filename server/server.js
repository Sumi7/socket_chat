//libraries imports
const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

//file imports
const generateMessage = require('../utils/messageGenerator');
const {isRealString} = require('../utils/validation');
const {Users} = require('../utils/users');

//declarations
const app = express();
const PORT = process.env.PORT || 3000;

//main
const PATH = path.join(__dirname, '../public');

const SERVER = http.createServer(app);
const io = socketIO(SERVER);
var users = new Users();

app.use(express.static(PATH));

io.on("connection", (socket) => {
  console.log("new connection...")

  socket.on('join', (params, cb) => {
      if(!isRealString(params.name) || !isRealString(params.room)){
          cb('Name and room name are required')
      }
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);

      io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat'));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
      cb();
  });

  socket.on('createMessage', (msg, cb) => {
    io.emit('newMessage', generateMessage(msg.from, msg.text));
    cb();
  });

  socket.on('disconnect', () =>{
    var user = users.removeUser(socket.id);
    if(user){
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });

});

SERVER.listen(PORT, function(){
  console.log(`server is running on port: ${PORT}`);
})

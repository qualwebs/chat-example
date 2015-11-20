var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jwt = require('jsonwebtoken');
var jwtSecret = 'shhhhhhared-secret';
var names = [];

//LOAD index.html
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//SOCKET CONNECTION
io.on('connection', function(socket){
  //Add user to room
  socket.on('new user', function(name,callback){
    if (names.indexOf(name) != -1) {
      callback(false);
    }
    else{
      callback(true);
      socket.nickname = name;
      names.push(socket.nickname);
      updateNames()
    }
  });
  function updateNames(){
    io.emit('usernames',names);
  }
  //Emit message
  socket.on('chat message', function(msg){
    io.emit('chat message',{name: socket.nickname,msg:msg});
  });
  //disconnetion
  socket.on('disconnect',function(data){
      if (!socket.nickname) return;
      names.splice(names.indexOf(socket.nickname),1);
      updateNames();
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
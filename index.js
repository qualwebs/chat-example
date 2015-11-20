var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jwt = require('jsonwebtoken');
var jwtSecret = 'shhhhhhared-secret';
//LOAD index.html
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
// USER AUTH
app.get('/login', function (req, res) {

  // TODO: validate the actual user user
  var profile = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    id: 123
  };

  // we are sending the profile in the token
  var token = jwt.sign(profile, jwtSecret, { expiresInMinutes: 60*5 });

  res.json({token: token});
});
//SOCKET CONNECTION
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log(msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
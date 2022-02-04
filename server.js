var express = require('express');
var app = express();
var socket = require('socket.io');

app.use(express.static('upload'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



var server = app.listen(8080, function () {
   console.log('Example app listening on port 8080!');
});

var io= socket(server,{
  cors: true,
  origins:["localhost:3000"]
});


io.on('connection', function(socket) {
   
   console.log('new client connected', socket.id);
   
   socket.on('join', function (data) {
    console.log('join--->',data);
    socket.join(data.room);
  });

    socket.on('setUser', function (data) {    
        console.log('setUSerdssss--->',data);
        io.to(data.room).emit('setUser', data);
    });

    socket.on('setImage', function (data) {  
      console.log('setImage--->',data);  
        io.to(data.room).emit('setImage', data);
    });

  

    socket.on('disconnect',()=>{
      console.log("user disconnected",socket.id)
    })


});



 
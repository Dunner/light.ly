


module.exports = function(app, io) {

  //Socket

  var users = {};

  io.sockets.on('connection', function(socket){

    socket.on('new user', function(userid){
      console.log(userid+' Logged in.');
      if (users[socket.userid] === userid) return;
      if (userid === 'userid') return;
      socket.userid = userid;
      users[socket.userid] = socket;
      io.sockets.emit('userlist', Object.keys(users));
    });

    socket.on('new topic', function(data){
      io.sockets.emit('new topic', data);
    });

    socket.on('new news', function(data){
      io.sockets.emit('new news', data);
    });

    socket.on('new globalchat', function(data){
      data.createdAt = Date.now();
      io.sockets.emit('new globalchat', data);
    });

    socket.on('new privatechat', function(data){
      var to = data.to;

      if(to in users){
        users[to].emit('new privatechat', data.message);
      }
    });

    socket.on('userlist', function(data){
      io.sockets.emit('userlist', Object.keys(users));
    });


    socket.on('logout', function(data){
      if(!data) return;
      delete users[socket.userid];
      io.sockets.emit('userlist', Object.keys(users));
      console.log(data+' logged out.');
    });

    socket.on('disconnect', function(data){
      if(!socket.userid) return;
      delete users[socket.userid];
      io.sockets.emit('userlist', Object.keys(users));
      console.log(socket.userid+' logged out.');
    });

  });

};
const io = require('socket.io')(4000);

let users = [];

io.on('connection', (socket) => {
  const username = `User${socket.id}`;
  users.push(username);
  io.emit('activeUsers', users);

  socket.on('draw', (data) => {
    socket.broadcast.emit('updateCanvas', data);
  });

  socket.on('disconnect', () => {
    users = users.filter(user => user !== username);
    io.emit('activeUsers', users);
  });
});

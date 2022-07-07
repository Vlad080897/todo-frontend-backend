import { Socket } from 'socket.io';
const Todo = require('../models/todoModel');

const socketEvents = (socket: Socket) => {

  socket.on('join', (data: { userId: string }) => {
    socket.join(`${data.userId}`);
  })

  socket.on('add-new-task', async (data: { userId: string }) => {
    socket.broadcast.to(`${data.userId}`).emit('receive_message');
  })
}

module.exports = {
  socketEvents
}
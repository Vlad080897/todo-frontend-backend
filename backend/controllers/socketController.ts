import { Socket } from 'socket.io';
const Todo = require('../models/todoModel');
const io = require('../server')

// const socketEvents = (socket: Socket) => {

//   socket.on('join', (data: { userId: string }) => {
//     console.log('joined the room:' + data.userId);
//     io.join(`${data.userId}`);
//   })

//   socket.on('add-new-task', async (data: { userId: string }) => {
//     io.broadcast.to(`${data.userId}`).emit('receive_message');
//   })
// }

// module.exports = {
//   socketEvents
// }
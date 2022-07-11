import express from 'express';
import mongoose from 'mongoose';
import todosRouter from './routes/todoRoutes';
import { Server, Socket } from 'socket.io'
import http from 'http';
const { socketEvents } = require('./controllers/socketController')
const cookieParser = require('cookie-parser')
const app = express();
const server = http.createServer(app);
const io = new Server(server);

mongoose.connect('mongodb+srv://mern_app:test123@cluster0.k6nxz.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    server.listen(8000, () => {
      console.log('listening port 8000');
    })
  })
  .catch((err: Error) => {
    console.log(err)
  });


io.on('connection', (socket: Socket) => {

  socket.on('join', (data: any) => {
    socket.join(`${data.userId}`);
  })

  socket.on('leave', (data: any) => {
    socket.leave(`${data.userId}`);
  })

  socket.on('add-new-task', (data: { userId: string }) => {
    socket.broadcast.to(`${data.userId}`).emit('receive-new-task');
  })

  socket.on('delete-task', (data: { id: string, userId: string }) => {
    socket.broadcast.to(`${data.userId}`).emit('receive-deleted-task', { taskId: data.id })
  })

})
app.use(express.json());
app.use(cookieParser());
app.use('/api/todos', todosRouter);




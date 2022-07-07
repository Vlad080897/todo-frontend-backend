import express from 'express';
import mongoose from 'mongoose';
import todosRouter from './routes/todoRoutes';
import { Server } from 'socket.io'
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


io.on('connection', (socket) => socketEvents(socket))
app.use(express.json());
app.use(cookieParser());
app.use('/api/todos', todosRouter);



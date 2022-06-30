import express from 'express';
import mongoose from 'mongoose';
const cookieParser = require('cookie-parser')
import todosRouter from './routes/todoRoutes';

const app = express();
mongoose.connect('mongodb+srv://mern_app:test123@cluster0.k6nxz.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    app.listen(8000, () => {
      console.log('listening port 8000');
    })
  })
  .catch((err: Error) => {
    //console.log(err)
  });

app.use(express.json());
app.use(cookieParser());
app.use('/api/todos', todosRouter);
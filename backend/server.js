const express = require('express');
const mongoose = require('mongoose');
const todosRouter = require('./routes/todoRoutes')

const app = express();
mongoose.connect('mongodb+srv://mern_app:test123@cluster0.k6nxz.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    app.listen(8000, () => {
      console.log('listening port 8000');
    })
  })
  .catch((err) => {
    console.log(err)
  });

app.use(express.json());
app.use('/api/todos', todosRouter);
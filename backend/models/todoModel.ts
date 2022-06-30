import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  },
  isEdit: {
    type: Boolean,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
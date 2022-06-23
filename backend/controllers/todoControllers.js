const { default: mongoose } = require('mongoose');
const Todo = require('../models/todoModel');

const getTasks = async (req, res) => {
  try {
    const allTasks = await Todo.find({});
    res.status(200).json(allTasks)
  } catch (error) {
    res.status(404).json({ error: 'Some error' })
  }
}

const addTask = async (req, res) => {
  const { description } = req.body
  if (!description || !description.trim()) {
    return res.status(404).json({ err: 'Description is required' });
  }
  try {
    const newTask = await Todo.create({ ...req.body });
    res.status(200).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(404).json({ err: 'Todo validation failed' })
  }
}

const deleteTasks = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ err: 'No such task' })
  };
  const task = await Todo.findByIdAndDelete({ _id: id })
  if (!task) {
    return res.status(404).json({ err: 'No such task' })
  };
  return res.status(200).json(task);
}

const clearCompleted = async (req, res) => {
  try {
    const tasks = await Todo.deleteMany({ completed: true });
    res.status(200).json(tasks);
  } catch (error) {
    return res.status(404).json({ err: 'Todo validation failed' })
  }
}

const checkAll = async (req, res) => {
  const { completedValue } = req.body;
  try {
    const tasks = await Todo.updateMany({}, { $set: { completed: completedValue } });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(404).json({ error: 'Todo validation failed' })
  }
}

const updateTask = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ err: 'No such task' })
  };
  const task = await Todo.findByIdAndUpdate({ _id: id }, { ...req.body })
  if (!task) {
    return res.status(404).json({ err: 'No such task' })
  };
  return res.status(200).json(task);
}

module.exports = {
  getTasks,
  addTask,
  deleteTasks,
  updateTask,
  clearCompleted,
  checkAll
}
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
const Todo = require('../models/todoModel');

const getTasks = async (req: Request<{ id: string }>, res: Response<{ allTasks?: TaskType[], error?: string }>) => {
  const userId = req.params.id;
  try {
    const allTasks: TaskType[] | [] = await Todo.find({ userId });
    res.status(200).json({ allTasks })
  } catch (error) {
    const massage = (error as Error).message;
    res.status(404).json({ error: massage })
  }
}

const addTask = async (req: Request<{}, {}, { description: string }>, res: Response<TaskType | { err: string }>) => {
  const { description } = req.body
  if (!description || !description.trim()) {
    return res.status(404).json({ err: 'Description is required' });
  }
  try {
    const newTask: TaskType = await Todo.create({ ...req.body });
    res.status(200).json(newTask);
  } catch (error) {
    res.status(404).json({ err: 'Todo validation failed' })
  }
}

const deleteTasks = async (req: Request<{ id: string }>, res: Response<TaskType | { err: string }>) => {
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

const clearCompleted = async (req: Request, res: Response<TaskType[] | { err: string }>) => {
  try {
    const tasks: TaskType[] = await Todo.deleteMany({ completed: true });
    res.status(200).json(tasks);
  } catch (error) {
    return res.status(404).json({ err: 'Todo validation failed' })
  }
}

const checkAll = async (req: Request<{}, {}, { completedValue: boolean }>, res: Response<TaskType[] | { error: string }>) => {
  const { completedValue } = req.body;
  try {
    const tasks: [TaskType] = await Todo.updateMany({}, { $set: { completed: completedValue } });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(404).json({ error: 'Todo validation failed' })
  }
}

const updateTask = async (req: Request<{ id: string }>, res: Response<TaskType | { err: string }>) => {
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

type TaskType = {
  _id: string,
  description: string,
  completed: boolean,
  isEdit: boolean,
  userId: string,
  createdAt: string,
  updatedAt: string,
  __v: number
}
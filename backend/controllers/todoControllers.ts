import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
const Todo = require('../models/todoModel');

export const getTasks = async (req: Request<{ id: string }>, res: Response<{ allTasks?: TaskType[], error?: string }>) => {
  const userId = req.params.id;
  try {
    const allTasks: TaskType[] | [] = await Todo.find({ userId });
    res.status(200).json({ allTasks })
  } catch (error) {
    res.status(404).json({ error: 'Get tasks failed' })
  }
}

export const addTask = async (req: Request<{}, {}, { description: string }>, res: Response<TaskType | { error: string }>) => {
  const { description } = req.body
  if (!description || !description.trim()) {
    return res.status(404).json({ error: 'Description is required' });
  }
  try {
    const newTask: TaskType = await Todo.create({ ...req.body });
    res.status(200).json(newTask);
  } catch (error) {
    res.status(404).json({ error: 'Todo validation failed' })
  }
}

export const deleteTasks = async (req: Request<{ id: string }>, res: Response<{ deletedTask: TaskType } | { error: string }>) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such task' })
  };
  const task = await Todo.findByIdAndDelete({ _id: id })
  if (!task) {
    return res.status(404).json({ error: 'No such task' })
  };
  return res.status(200).json({ deletedTask: task });
}

export const clearCompleted = async (req: Request<{}, {}, { id: string }>, res: Response<string | { err: string }>) => {
  const { id } = req.body
  try {
    const tasks: TaskType[] = await Todo.find({ userId: id }).deleteMany({ completed: true });
    res.status(200).json('Chosen tasks successfully deleted');
  } catch (error) {
    return res.status(404).json({ err: 'Something went wrong' })
  }
}

export const checkAll = async (req: Request<{}, {}, { id, completedValue: boolean }>, res: Response<TaskType[] | { error: string }>) => {
  const { id, completedValue } = req.body;
  try {
    const tasks: [TaskType] = await Todo.updateMany({ userId: id }, { $set: { completed: completedValue } });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(404).json({ error: 'Something went wrong' })
  }
}

export const updateTask = async (req: Request<{ id: string }>, res: Response<TaskType | { error: string }>) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such task' })
  };
  const task = await Todo.findByIdAndUpdate({ _id: id }, { ...req.body })
  if (!task) {
    return res.status(404).json({ error: 'No such task' })
  };
  return res.status(200).json(task);
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
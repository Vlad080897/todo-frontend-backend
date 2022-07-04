import express from 'express';

import { getTasks, addTask, deleteTasks, updateTask, clearCompleted, checkAll } from '../controllers/todoControllers';

import { loginPost, signupPost, logout, getUser, getNewToken } from '../controllers/authControllers';

import { checkIsUser } from '../middlewares/authMiddlware';
const router = express.Router();

router.post('/token', getNewToken)

router.get('/auth', getUser)

router.get('/logout', logout)

router.get('/:id', getTasks)

router.post('/', checkIsUser, addTask)

router.post('/token', getNewToken)

router.patch('/clear', checkIsUser, clearCompleted)

router.patch('/check_all', checkIsUser, checkAll)

router.delete('/:id', checkIsUser, deleteTasks)

router.patch('/:id', checkIsUser, updateTask)

router.post('/login', loginPost)

router.post('/signup', signupPost)


export default router
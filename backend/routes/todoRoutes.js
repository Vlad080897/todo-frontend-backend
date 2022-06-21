const express = require('express');
const {
  getTasks,
  addTask,
  deleteTasks,
  updateTask,
  clearCompleted,
  checkAll
} = require('../controllers/todoControllers')
const router = express.Router();

router.get('/', getTasks)

router.post('/', addTask)

router.patch('/clear', clearCompleted)

router.patch('/check_all', checkAll)

router.delete('/:id', deleteTasks)

router.patch('/:id', updateTask)


module.exports = router
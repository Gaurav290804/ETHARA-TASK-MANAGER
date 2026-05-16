const express = require('express');
const router = express.Router();
const { getTask, updateTask, deleteTask, updateTaskStatus } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createProject, getProjects, getProject,
  updateProject, deleteProject, addMember, removeMember
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/auth');

// Task routes nested under project
const { createTask, getProjectTasks } = require('../controllers/taskController');

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(adminOnly, createProject);

router.route('/:id')
  .get(getProject)
  .put(adminOnly, updateProject)
  .delete(adminOnly, deleteProject);

router.route('/:id/members')
  .post(adminOnly, addMember);

router.route('/:id/members/:userId')
  .delete(adminOnly, removeMember);

router.route('/:id/tasks')
  .get(getProjectTasks)
  .post(createTask);

module.exports = router;

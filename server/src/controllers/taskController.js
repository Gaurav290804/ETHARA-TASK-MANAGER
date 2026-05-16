const Task = require('../models/Task');
const Project = require('../models/Project');

// POST /api/projects/:id/tasks
exports.createTask = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (req.user.role !== 'admin' && !project.members.some(m => m.equals(req.user._id))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, status, priority, assignedTo, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: 'Task title is required' });

    const task = await Task.create({
      title, description, status, priority, assignedTo, dueDate,
      projectId: req.params.id,
      createdBy: req.user._id
    });

    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/projects/:id/tasks
exports.getProjectTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (req.user.role !== 'admin' && !project.members.some(m => m.equals(req.user._id))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const filter = { projectId: req.params.id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tasks/:id
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.projectId);
    if (req.user.role !== 'admin' && !project.members.some(m => m.equals(req.user._id))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.projectId);

    if (req.user.role !== 'admin') {
      if (!project.members.some(m => m.equals(req.user._id))) {
        return res.status(403).json({ message: 'Access denied' });
      }
      // Members can only edit their own tasks
      if (!task.createdBy.equals(req.user._id) && !(task.assignedTo && task.assignedTo.equals(req.user._id))) {
        return res.status(403).json({ message: 'You can only edit your own tasks' });
      }
    }

    const allowed = ['title', 'description', 'status', 'priority', 'assignedTo', 'dueDate'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'admin' && !task.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only admin or task creator can delete tasks' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/tasks/:id/status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['todo', 'in-progress', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.projectId);
    if (!project.members.some(m => m.equals(req.user._id)) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

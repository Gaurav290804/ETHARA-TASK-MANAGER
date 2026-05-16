const Task = require('../models/Task');
const Project = require('../models/Project');

// GET /api/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let projectFilter = {};
    let taskFilter = {};

    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({ members: req.user._id }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      projectFilter = { _id: { $in: projectIds } };
      taskFilter = { projectId: { $in: projectIds }, assignedTo: req.user._id };
    }

    const [totalProjects, totalTasks, todoTasks, inProgressTasks, doneTasks, overdueTasks] = await Promise.all([
      Project.countDocuments(projectFilter),
      Task.countDocuments(taskFilter),
      Task.countDocuments({ ...taskFilter, status: 'todo' }),
      Task.countDocuments({ ...taskFilter, status: 'in-progress' }),
      Task.countDocuments({ ...taskFilter, status: 'done' }),
      Task.countDocuments({ ...taskFilter, dueDate: { $lt: today }, status: { $ne: 'done' } })
    ]);

    const recentTasks = await Task.find(taskFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('assignedTo', 'name email')
      .populate('projectId', 'title');

    res.json({
      totalProjects,
      totalTasks,
      tasksByStatus: { todo: todoTasks, 'in-progress': inProgressTasks, done: doneTasks },
      overdueTasks,
      recentTasks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

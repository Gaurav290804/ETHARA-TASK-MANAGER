const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Project title is required' });

    const project = await Project.create({
      title, description, createdBy: req.user._id, members: [req.user._id]
    });
    await project.populate('createdBy', 'name email');
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('createdBy', 'name email').populate('members', 'name email role');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('createdBy', 'name email').populate('members', 'name email role');
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/:id
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email role');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (req.user.role !== 'admin' && !project.members.some(m => m._id.equals(req.user._id))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({ projectId: project._id })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json({ ...project.toObject(), tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('createdBy', 'name email').populate('members', 'name email role');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await Task.deleteMany({ projectId: req.params.id });
    res.json({ message: 'Project and its tasks deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects/:id/members
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(userId);
    await project.save();
    await project.populate('members', 'name email role');
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/projects/:id/members/:userId
exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.members = project.members.filter(m => !m.equals(req.params.userId));
    await project.save();
    await project.populate('members', 'name email role');
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

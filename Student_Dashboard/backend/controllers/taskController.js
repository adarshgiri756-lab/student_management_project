import Task from '../models/Task.js';
import Student from '../models/Student.js';

const buildTaskQuery = (queryParams) => {
  const { search = '', status = '', priority = '', category = '' } = queryParams;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { priority: { $regex: search, $options: 'i' } }
    ];
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;

  return query;
};

const addHistory = (task, action, user, role) => {
  task.history.push({
    action,
    status: task.status,
    updatedBy: user.name,
    updatedByRole: role
  });
};

export const getTasks = async (req, res, next) => {
  try {
    const query = buildTaskQuery(req.query);

    if (req.userRole === 'student') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'studentId name email branch semester section profilePhoto')
      .populate('assignedBy', 'studentId name email')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, dueDate, assignedTo } = req.body;

    if (!title || !description || !dueDate || !assignedTo) {
      return res.status(400).json({ message: 'Please fill all required task fields.' });
    }

    const student = await Student.findById(assignedTo);

    if (!student) {
      return res.status(404).json({ message: 'Assigned student not found.' });
    }

    const task = new Task({
      title,
      description,
      priority,
      category,
      dueDate,
      assignedTo,
      assignedBy: req.user._id
    });

    addHistory(task, 'Task assigned', req.user, req.userRole);
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'studentId name email branch semester section profilePhoto')
      .populate('assignedBy', 'studentId name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const isOwner = task.assignedTo.toString() === req.user._id.toString();

    if (req.userRole !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'You can only update your own tasks.' });
    }

    const studentAllowedFields = ['status'];
    const adminAllowedFields = ['title', 'description', 'priority', 'category', 'dueDate', 'status', 'assignedTo'];
    const allowedFields = req.userRole === 'admin' ? adminAllowedFields : studentAllowedFields;

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    addHistory(task, 'Task updated', req.user, req.userRole);
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'studentId name email branch semester section profilePhoto')
      .populate('assignedBy', 'studentId name email');

    res.json(populatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const getTasksByStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId.toLowerCase() });

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    if (req.userRole !== 'admin' && student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to view these tasks.' });
    }

    const tasks = await Task.find({ assignedTo: student._id })
      .populate('assignedTo', 'studentId name email branch semester section profilePhoto')
      .populate('assignedBy', 'studentId name email')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

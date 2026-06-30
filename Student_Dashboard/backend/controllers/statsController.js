import Student from '../models/Student.js';
import Task from '../models/Task.js';

const getTaskStats = async (baseQuery = {}) => {
  const now = new Date();
  const [totalTasks, completedTasks, pendingTasks, inProgressTasks, cancelledTasks, overdueTasks] =
    await Promise.all([
      Task.countDocuments(baseQuery),
      Task.countDocuments({ ...baseQuery, status: 'Completed' }),
      Task.countDocuments({ ...baseQuery, status: 'Pending' }),
      Task.countDocuments({ ...baseQuery, status: 'In Progress' }),
      Task.countDocuments({ ...baseQuery, status: 'Cancelled' }),
      Task.countDocuments({
        ...baseQuery,
        dueDate: { $lt: now },
        status: { $nin: ['Completed', 'Cancelled'] }
      })
    ]);

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    cancelledTasks,
    overdueTasks,
    completionPercentage: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
  };
};

export const getStats = async (req, res, next) => {
  try {
    const baseQuery = req.userRole === 'student' ? { assignedTo: req.user._id } : {};
    const taskStats = await getTaskStats(baseQuery);
    const totalStudents = req.userRole === 'admin' ? await Student.countDocuments() : undefined;
    const recentTasks = await Task.find(baseQuery)
      .populate('assignedTo', 'studentId name')
      .populate('assignedBy', 'studentId name')
      .sort({ updatedAt: -1 })
      .limit(6);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    const todaysTasks = await Task.find({
      ...baseQuery,
      dueDate: { $gte: todayStart, $lt: todayEnd }
    }).sort({ dueDate: 1 });

    res.json({
      ...taskStats,
      totalStudents,
      recentTasks,
      todaysTasks
    });
  } catch (error) {
    next(error);
  }
};

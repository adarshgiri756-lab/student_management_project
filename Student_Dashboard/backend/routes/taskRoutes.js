import express from 'express';
import {
  createTask,
  deleteTask,
  getTasks,
  getTasksByStudent,
  updateTask
} from '../controllers/taskController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getTasks).post(adminOnly, createTask);
router.get('/student/:studentId', getTasksByStudent);
router.route('/:id').put(updateTask).delete(adminOnly, deleteTask);

export default router;

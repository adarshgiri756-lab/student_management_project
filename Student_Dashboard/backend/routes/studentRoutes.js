import express from 'express';
import {
  createStudent,
  deleteStudent,
  getStudents,
  resetStudentPassword,
  updateStudent
} from '../controllers/studentController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);
router.route('/').get(getStudents).post(createStudent);
router.route('/:id').put(updateStudent).delete(deleteStudent);
router.patch('/:id/reset-password', resetStudentPassword);

export default router;

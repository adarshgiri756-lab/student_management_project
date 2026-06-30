import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';
import Task from '../models/Task.js';

export const getStudents = async (req, res, next) => {
  try {
    const { search = '', branch = '', semester = '', section = '' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { studentId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { branch: { $regex: search, $options: 'i' } }
      ];
    }

    if (branch) query.branch = branch;
    if (semester) query.semester = semester;
    if (section) query.section = section.toUpperCase();

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const { studentId, name, email, branch, semester, section, password, profilePhoto } = req.body;

    if (!studentId || !name || !email || !branch || !semester || !section || !password) {
      return res.status(400).json({ message: 'Please fill all required student fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const student = await Student.create({
      studentId,
      name,
      email,
      branch,
      semester,
      section,
      profilePhoto,
      password: await bcrypt.hash(password, 12)
    });

    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const allowedFields = ['studentId', 'name', 'email', 'branch', 'semester', 'section', 'profilePhoto'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const student = await Student.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    await Task.deleteMany({ assignedTo: student._id });
    await student.deleteOne();

    res.json({ message: 'Student and assigned tasks deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const resetStudentPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const student = await Student.findById(req.params.id).select('+password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    student.password = await bcrypt.hash(newPassword, 12);
    await student.save();

    res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    next(error);
  }
};

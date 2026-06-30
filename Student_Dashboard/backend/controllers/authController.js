import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Student from '../models/Student.js';
import generateToken from '../utils/generateToken.js';

const publicUser = (user, role) => ({
  id: user._id,
  studentId: user.studentId,
  name: user.name,
  email: user.email,
  role,
  branch: user.branch,
  semester: user.semester,
  section: user.section,
  profilePhoto: user.profilePhoto
});

export const login = async (req, res, next) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({ message: 'Student ID and password are required.' });
    }

    const normalizedStudentId = studentId.trim().toLowerCase();
    let role = 'student';
    let user = await Student.findOne({ studentId: normalizedStudentId }).select('+password');

    if (!user) {
      role = 'admin';
      user = await Admin.findOne({ studentId: normalizedStudentId }).select('+password');
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid Student ID or Password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid Student ID or Password' });
    }

    const token = generateToken({ id: user._id, role });

    res.json({
      token,
      user: publicUser(user, role)
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.json({ message: 'Logged out successfully.' });
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const Model = req.userRole === 'admin' ? Admin : Student;
    const user = await Model.findById(req.user._id).select('+password');
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({ user: publicUser(req.user, req.userRole) });
};

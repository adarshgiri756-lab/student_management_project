import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

const seedAdmin = async () => {
  const existingAdmin = await Admin.findOne({ studentId: '1001' });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('123456', 12);
    await Admin.create({
      studentId: '1001',
      name: 'System Administrator',
      email: 'admin@studentdashboard.local',
      password: hashedPassword
    });
    console.log('Default admin created: 1001 / 123456');
  }
};

export default seedAdmin;

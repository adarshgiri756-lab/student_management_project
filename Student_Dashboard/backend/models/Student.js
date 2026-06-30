import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    branch: {
      type: String,
      required: true,
      trim: true
    },
    semester: {
      type: String,
      required: true,
      trim: true
    },
    section: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    profilePhoto: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      required: true,
      select: false
    }
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);

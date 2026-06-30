import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true
    },
    status: {
      type: String
    },
    updatedBy: {
      type: String,
      required: true
    },
    updatedByRole: {
      type: String,
      enum: ['admin', 'student'],
      required: true
    }
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    category: {
      type: String,
      enum: ['Study', 'Assignment', 'Exam', 'Project'],
      default: 'Study'
    },
    dueDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    history: [historySchema]
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);

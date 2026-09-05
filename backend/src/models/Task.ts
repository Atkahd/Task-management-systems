import mongoose, { Document, Schema } from 'mongoose';

export interface ITaskDocument extends Document {
  title: string;
  description: string;
  status: 'TODO' | 'DOING' | 'DONE';
  creator: mongoose.Types.ObjectId;
  assignedUser: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['TODO', 'DOING', 'DONE'],
      default: 'TODO',
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    assignedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null, 
    }
  }, 
  {
    timestamps: true, 
  }
);

TaskSchema.index({ creator: 1 });
TaskSchema.index({ assignedUser: 1 });
TaskSchema.index({ status: 1 });

const Task = mongoose.model<ITaskDocument>('Task', TaskSchema);

export default Task;
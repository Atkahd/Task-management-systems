import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password?: string; 
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}


const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, 
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  {
    timestamps: true, 
  }
);


UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
  }
});


UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};


UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    
    const retObj = ret as Record<string, any>;
    delete retObj.password;
    delete retObj.__v;
    return retObj;
  },
});

const User = mongoose.model<IUserDocument>('User', UserSchema);

export default User;
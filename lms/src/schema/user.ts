import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user'|'instructor'|'subadmin' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  purchasedCourses?: string[]; 
}


const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'instructor', 'subadmin', 'admin'],
    default: 'user' 
  },
  purchasedCourses: [{ type: String, ref: 'Course' }] 
}, { timestamps: true });



export default (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

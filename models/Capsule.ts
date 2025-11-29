import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User'; // We'll import the User interface

// 1. Create an interface for our Capsule
export interface ICapsule extends Document {
  title: string;
  message: string;
  unlockDate: Date;
  user: IUser['_id']; // Reference to the User who owns the capsule
  status: 'cooling-down' | 'sealed' | 'unlocked' | 'archived';
  // createdAt and updatedAt are automatically added by timestamps
}

// 2. Create the Mongoose Schema
const CapsuleSchema = new Schema<ICapsule>({
  title: {
    type: String,
    required: [true, 'Please provide a title for the capsule.'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Please provide a message for the capsule.'],
  },
  unlockDate: {
    type: Date,
    required: [true, 'Please provide an unlock date.'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This creates the relationship to the User model
    required: true,
  },
  status: {
    type: String,
    enum: ['cooling-down', 'sealed', 'unlocked', 'archived'],
    default: 'cooling-down',
  },
}, {
  timestamps: true,
});

// 3. Create and export the Model
const CapsuleModel = mongoose.models.Capsule || mongoose.model<ICapsule>('Capsule', CapsuleSchema);

export default CapsuleModel;
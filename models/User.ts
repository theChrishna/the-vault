import mongoose, { Document, Model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  // createdAt and updatedAt are automatically added by timestamps
}

// 2. Create a Schema corresponding to the document interface.
const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
  },
}, {
  timestamps: true,
});

// 3. Create a Model.
// This line prevents Mongoose from redefining the model every time.
// It checks if a model named 'User' already exists and uses that, or creates a new one.
const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
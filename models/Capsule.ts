import mongoose from 'mongoose';

const CapsuleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
  },
  unlockDate: {
    type: Date,
    required: [true, 'Please provide an unlock date'],
  },
  // --- IMPORTANT: These fields store your file ---
  attachment: {
    type: String, // Stores the Base64 string of the file
  },
  attachmentName: {
    type: String, // e.g., "my-photo.jpg"
  },
  attachmentType: {
    type: String, // e.g., "image/jpeg"
  },
}, { timestamps: true });

export default mongoose.models.Capsule || mongoose.model('Capsule', CapsuleSchema);
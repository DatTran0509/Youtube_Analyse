import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: false,
      default: 'User'
    },
    firstName: {
      type: String,
      required: false
    },
    lastName: {
      type: String,
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });
  
  userSchema.index({ clerkUserId: 1 }, { unique: true });
  
  userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
  });

const User = mongoose.model('User', userSchema);
export default User;
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    photo: String,
    password: String,
    socialID: {
      type: String,
      unique: true,
    },
    code: String,
    points: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: 'normal',
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);

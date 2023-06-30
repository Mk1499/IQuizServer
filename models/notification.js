import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    title: String,
    body: String,
    type: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    photo: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notification', notificationSchema);

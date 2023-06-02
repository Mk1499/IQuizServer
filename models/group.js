import mongoose, { Mongoose } from 'mongoose';

const Schema = mongoose.Schema;

const groupSchema = new Schema(
  {
    title: String,
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    code: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Group', groupSchema);

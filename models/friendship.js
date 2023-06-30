import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const friendshipSchema = new Schema(
  {
    status: {
      type: String,
      default: 'pending',
    },
    from: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    to: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    users: {
      type: [mongoose.Types.ObjectId],
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Friendship', friendshipSchema);

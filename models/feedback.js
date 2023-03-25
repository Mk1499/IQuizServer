import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Feedback', feedbackSchema);

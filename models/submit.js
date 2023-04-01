import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const submitSchema = new Schema(
  {
    quiz: {
      type: mongoose.Types.ObjectId,
      ref: 'Quiz',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    score: {
      type: Number,
      default: 0,
    },
    time: Number,
    submit: [
      {
        question: {
          type: mongoose.Types.ObjectId,
          ref: 'Question',
        },
        answer: {
          type: mongoose.Types.ObjectId,
          ref: 'Answer',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Submit', submitSchema);

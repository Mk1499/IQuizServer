import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    label: String,
    type: {
      type: String,
      default: 'choose',
    },
    answers: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Answer',
      },
    ],
    rightAnswer: {
      type: mongoose.Types.ObjectId,
      ref: 'Answer',
    },
    points: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Question', questionSchema);

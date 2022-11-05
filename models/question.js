import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    label: String,
    type: String,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Question', questionSchema);

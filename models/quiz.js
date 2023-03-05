import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const quizSchema = new Schema(
  {
    title: String,
    description: String,
    lang: { type: String, default: 'ar' },
    noOfQuestions: { type: Number, default: 0 },
    duration: {
      type: mongoose.Types.ObjectId,
      ref: 'Duration',
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
    questions: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Question',
      },
    ],
    points: { type: Number, default: 0 },
    cover: String,
    submissions: {
      type: Number,
      default: 0,
    },
    startData: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Quiz', quizSchema);

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const takenSchema = new Schema(
  {
    quiz: {
      type: mongoose.Types.ObjectId,
      ref: 'Quiz',
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

export default mongoose.model('TakenQuiz', takenSchema);

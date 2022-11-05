import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const quizSchema = new Schema({
  title: String,
  noOfQuestions: Number,
  duration:{
    type: mongoose.Types.ObjectId,
    ref : 'Duration'
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
  ]
});

export default mongoose.model('Quiz', quizSchema);

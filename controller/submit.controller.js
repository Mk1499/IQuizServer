import Quiz from '../models/quiz.js';
import { Types } from 'mongoose';
import Submit from '../models/submit.js';
import User from '../models/user.js';

export async function computeScore(quizID, submit) {
  let score = 0;
  const quiz = await Quiz.findById(quizID).populate('questions').populate({
    path: 'questions',
    populate: 'answers',
  });
  const questions = quiz.questions;
  submit.map((s) => {
    const relatedQuestion = questions.find((q) =>
      q._id.equals(new Types.ObjectId(s.questionID))
    );
    if (relatedQuestion?.rightAnswer.equals(new Types.ObjectId(s.answerID))) {
      score += relatedQuestion.points;
    }
  });
  return score;
}

export async function addNewSubmit(userID, quizID, submittion, score, time) {
  const submit = submittion?.map((s) => ({
    question: s.questionID,
    answer: s.answerID,
  }));
  const newSubmittion = new Submit({
    userID,
    quizID,
    submit,
    score,
    time,
  }).save();
  await Quiz.updateOne({ _id: quizID }, { $inc: { submissions: 1 } });
  await User.updateOne({ _id: userID }, { $inc: { submissions: 1 } });
}

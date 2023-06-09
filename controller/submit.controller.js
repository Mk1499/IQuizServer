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
    user: userID,
    quiz: quizID,
    submit,
    score,
    time,
  }).save();
  await Quiz.updateOne({ _id: quizID }, { $inc: { submissions: 1 } });
  await User.updateOne({ _id: userID }, { $inc: { submissions: 1 } });
}

export async function listUserSubmits(req, res) {
  const userID = req.params.id;
  Submit.find({
    user: userID,
  })
    .sort({
      createdAt: -1,
    })
    .populate('user quiz')
    .populate({
      path: 'submit',
      populate: 'question',
    })
    .populate({
      path: 'submit.question',
      populate: 'answers',
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export async function showSubmit(req, res) {
  const { id } = req.params;
  Submit.findById(id)

    .populate({
      path: 'submit',
      populate: 'question',
    })
    .populate({
      path: 'submit.question',
      populate: 'answers',
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

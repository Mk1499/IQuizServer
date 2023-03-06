import express from 'express';
import Quiz from '../models/quiz.js';
import Question from '../models/question.js';
import Answer from '../models/answer.js';
import {
  addQuestionToQuiz,
  getQuizPreData,
} from '../controller/quiz.controller.js';

import uuid from 'short-uuid';

const quizRouter = express.Router();

quizRouter.get('/', (req, res) => {
  Quiz.find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

quizRouter.post('/add', (req, res) => {
  const { title, duration, category, lang, description, startDate, endDate } =
    req.body;
  let code = uuid.generate();

  const quiz = new Quiz({
    title,
    duration,
    category,
    lang,
    description,
    code,
    startDate,
    endDate,
  });
  quiz
    .save()
    .then((q) => {
      res.status(200).json(q);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

quizRouter.post('/addQuestion', async (req, res) => {
  const { quizID, questionID } = req.body;
  addQuestionToQuiz(questionID, quizID, req, res);
});

quizRouter.post('/addNewQuestion', async (req, res) => {
  const { quizID, label, answers, rightAnswer, points } = req.body;
  const ans = await Answer.insertMany(answers);
  const ansIDs = ans.map((a) => a._id);
  const rightAnswerID = ans.find((a) => a.label === rightAnswer)?._id;
  const question = new Question({
    label,
    points,
    answers: ansIDs,
    rightAnswer: rightAnswerID,
  });
  question.save().then((q) => {
    addQuestionToQuiz(q._id, quizID, req, res);
  });
});

quizRouter.get('/predata', (req, res) => {
  getQuizPreData(req, res);
});

quizRouter.get('/:id', (req, res) => {
  const id = req.params.id;
  Quiz.findById(id)
    .populate('duration category questions')
    .populate({
      path: 'questions',
      populate: 'answers',
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
export default quizRouter;

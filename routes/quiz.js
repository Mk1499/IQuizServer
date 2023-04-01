import express from 'express';
import Quiz from '../models/quiz.js';
import Question from '../models/question.js';
import Answer from '../models/answer.js';
import {
  addNewQuestion,
  addQuestionToQuiz,
  addQuiz,
  deleteQuiz,
  getQuizMetaData,
  getQuizPreData,
  joinByCode,
  listQuizzes,
} from '../controller/quiz.controller.js';

import uuid from 'short-uuid';
import { adminAuthorization, authorization } from '../middlewares/user.js';
import { verifyToken } from '../utils/encryption.js';
import Submit from '../models/submit.js';
import TakenQuiz from '../models/takenQuiz.js';
import ErrorMessages from '../utils/errorMessages.js';

const quizRouter = express.Router();

quizRouter.get('/', (req, res) => {
  listQuizzes(req, res);
});

quizRouter.post('/add', (req, res) => {
  addQuiz(req, res);
});

quizRouter.post('/addQuestion', async (req, res) => {
  const { quizID, questionID } = req.body;
  addQuestionToQuiz(questionID, quizID, req, res);
});

quizRouter.post('/addNewQuestion', async (req, res) => {
  addNewQuestion(req, res);
});

quizRouter.delete('/:id', (req, res) => {
  deleteQuiz(req, res);
});

quizRouter.get('/predata', (req, res) => {
  getQuizPreData(req, res);
});

quizRouter.get('/join/:code', (req, res) => {
  joinByCode(req, res);
});
quizRouter.get('/metadata/:id', (req, res) => {
  getQuizMetaData(req, res);
});

quizRouter.get('/questions/:id', authorization, async (req, res) => {
  const token = req.headers.authorization;
  const userData = verifyToken(token);
  const id = req.params.id;
  const prevSubmit = await TakenQuiz.findOne({
    user: userData?._id,
    quiz: id,
  });

  if (prevSubmit) {
    res.status(400).json({ message: ErrorMessages.prevSubmitted });
  } else {
    const takeRecord = new TakenQuiz({
      user: userData?._id,
      quiz: id,
    }).save();
    Quiz.findById(id)
      .populate({
        path: 'questions',
        select: '-rightAnswer',
        populate: 'answers',
      })
      .then((data) => {
        if (data) {
          res.status(200).send(data);
        } else {
          res.status(404).send({ message: 'Quiz not fount' });
        }
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
});

quizRouter.get('/:id', adminAuthorization, (req, res) => {
  const id = req.params.id;
  Quiz.findById(id)
    .populate('duration category questions')
    .populate({
      path: 'questions',
      populate: 'answers',
    })
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send({ message: 'Quiz not fount' });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

export default quizRouter;

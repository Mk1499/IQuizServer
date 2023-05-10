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
  getQuizRank,
  joinByCode,
  latestQuizzes,
  listQuizzes,
  quizHaveQuestion,
} from '../controller/quiz.controller.js';

import uuid from 'short-uuid';
import { adminAuthorization, authorization } from '../middlewares/user.js';
import { verifyToken } from '../utils/encryption.js';
import Submit from '../models/submit.js';
import TakenQuiz from '../models/takenQuiz.js';
import ErrorMessages from '../utils/errorMessages.js';
import { quizLandMaker } from '../controller/automation.controller.js';

const quizRouter = express.Router();

quizRouter.get('/', (req, res) => {
  listQuizzes(req, res);
});

quizRouter.post('/add', authorization, (req, res) => {
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

  if (prevSubmit && false) {
    res.status(400).json({ message: ErrorMessages.prevSubmitted });
  } else {
    const takeRecord = new TakenQuiz({
      user: userData?._id,
      quiz: id,
    }).save();
    Quiz.findById(id)
      .populate('duration')
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

quizRouter.get('/rank/:id', authorization, (req, res) => {
  getQuizRank(req, res);
});
quizRouter.get('/ranklimit/:id', authorization, (req, res) => {
  getQuizRank(req, res, 10);
});

quizRouter.post('/quizLandMaker', adminAuthorization, (req, res) => {
  quizLandMaker(req, res);
});

quizRouter.get('/freeDummy', adminAuthorization, (req, res) => {
  // const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
  // Answer.deleteMany({ createdAt: { $gte: threeHoursAgo } })
  //   .then((data) => {
  //     res.json({ message: 'Deleted', data });
  //   })
  //   .catch((err) => {
  //     res.send(err);
  //   });
  // Submit.deleteMany({
  //   user: '6412479c250656d3baa77f6f',
  // })
  //   .then((data) => {
  //     res.send(data);
  //   })
  //   .catch((err) => {
  //     res.status(400).send(err);
  //   });
});

quizRouter.get('/latest', authorization, (req, res) => {
  latestQuizzes(req, res);
});

quizRouter.get('/checkQuestion/:id', adminAuthorization, (req, res) => {
  quizHaveQuestion(req, res);
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

import express from 'express';
import {
  listInCompleteQuestions,
  setRightAnswer,
} from '../controller/question.controller.js';
import { adminAuthorization } from '../middlewares/user.js';
import Question from '../models/question.js';

const questionRouter = express.Router();

questionRouter.get('/', (req, res) => {
  Question.find({})
    .populate('answers rightAnswer')
    .then((questions) => {
      res.status(200).json(questions);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

questionRouter.get('/details/:id', (req, res) => {
  Question.findById(req.params.id)
    .populate('answers rightAnswer')
    .then((q) => {
      res.status(200).json(q);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

questionRouter.post('/add', (req, res) => {
  const q = new Question(req.body);
  q.save()
    .then((question) => {
      res.status(200).json(question);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

questionRouter.get('/incomplete', adminAuthorization, (req, res) => {
  listInCompleteQuestions(req, res);
});

questionRouter.post('/setRightAns', adminAuthorization, (req, res) => {
  setRightAnswer(req, res);
});

export default questionRouter;

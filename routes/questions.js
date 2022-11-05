import express from 'express';
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

export default questionRouter;

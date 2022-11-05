import express from 'express';
import Answer from '../models/answer.js';

const answerRouter = express.Router();

answerRouter.post('/add', (req, res) => {
  const a = new Answer(req.body);
  a.save()
    .then((ans) => {
      res.status(200).json(ans);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

answerRouter.get('/', (req, res) => {
  Answer.find({})
    .then((answers) => {
      res.status(200).json(answers);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

export default answerRouter;

import express from 'express';
import {
  addNewSubmit,
  computeScore,
  listUserSubmits,
} from '../controller/submit.controller.js';
import { updateRanks } from '../controller/user.controller.js';
import {
  adminAuthorization,
  authorization,
  isMine,
} from '../middlewares/user.js';
import Quiz from '../models/quiz.js';
import Submit from '../models/submit.js';
import User from '../models/user.js';

const submitRouter = express.Router();

submitRouter.post('/add', authorization, async (req, res) => {
  const { userID, quizID, submit, time } = req.body;
  const score = await computeScore(quizID, submit);
  const quiz = await Quiz.findById(quizID);
  if (quiz.status === 'Public') {
    await User.findByIdAndUpdate(userID, { $inc: { points: score } })
      .then(async () => {
        updateRanks();

        await addNewSubmit(userID, quizID, submit, score, time);
        res.status(200).json(score);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    addNewSubmit(userID, quizID, submit, score, time, false)
      .then(() => {
        res.status(200).json(score);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
});

submitRouter.get('/list', adminAuthorization, async (req, res) => {
  Submit.find({})
    .sort({ createdAt: -1 })
    .populate('user quiz')
    .populate({
      path: 'submit',
      populate: 'answer question',
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

submitRouter.get('/list/:id', isMine, (req, res) => {
  listUserSubmits(req, res);
});

export default submitRouter;

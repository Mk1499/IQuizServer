import express from 'express';
import Feedback from '../models/feedback.js';
import { authorization } from '../middlewares/user.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/add', authorization, (req, res) => {
  const f = new Feedback(req.body);
  f.save()
    .then((feedback) => {
      res.status(200).json(feedback);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

feedbackRouter.get('/', authorization, (req, res) => {
  Feedback.find({})
    .populate('user')
    .then((feedbacks) => {
      res.status(200).json(feedbacks);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

export default feedbackRouter;

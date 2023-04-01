import express from 'express';
import Feedback from '../models/feedback.js';
import { authorization } from '../middlewares/user.js';
import {
  addFeedback,
  listFeedbacks,
} from '../controller/feedback.controller.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/add', authorization, (req, res) => {
  addFeedback(req, res);
});

feedbackRouter.get('/', authorization, (req, res) => {
  listFeedbacks(req, res);
});

export default feedbackRouter;

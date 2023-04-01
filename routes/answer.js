import express from 'express';
import { authorization } from '../middlewares/user.js';
import { addAnswer, listAnswers } from '../controller/answer.controller.js';

const answerRouter = express.Router();

answerRouter.post('/add', (req, res) => {
  addAnswer(req, res);
});

answerRouter.get('/', authorization, (req, res) => {
  listAnswers(req, res);
});

export default answerRouter;

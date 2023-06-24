import express from 'express';
import {
  generalSearch,
  usersSearch,
  groupSearch,
  quizzesSearch,
} from '../controller/search.controller.js';

const searchRouter = express.Router();

searchRouter.get('/general/:query', (req, res) => {
  generalSearch(req, res);
});

searchRouter.get('/users/:query', (req, res) => {
  usersSearch(req, res);
});

searchRouter.get('/quizzes/:query', (req, res) => {
  quizzesSearch(req, res);
});

searchRouter.get('/groups/:query', (req, res) => {
  groupSearch(req, res);
});

export default searchRouter;

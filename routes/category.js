import express from 'express';
import {
  addCategory,
  getCategoryQuizzes,
  listCategories,
} from '../controller/category.controller.js';
import Category from '../models/category.js';

const categoryRouter = express.Router();

categoryRouter.get('/', (req, res) => {
  listCategories(req, res);
});

categoryRouter.post('/add', (req, res) => {
  addCategory(req, res);
});

categoryRouter.get('/quizzes/:categoryID', (req, res) => {
  getCategoryQuizzes(req, res);
});

export default categoryRouter;

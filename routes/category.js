import express from 'express';
import { getCategoryQuizzes } from '../controller/category.controller.js';
import Category from '../models/category.js';

const categoryRouter = express.Router();

categoryRouter.get('/', (req, res) => {
  Category.find({})
    .then((cats) => {
      res.status(200).json(cats);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

categoryRouter.post('/add', (req, res) => {
  const cat = new Category(req.body);
  cat
    .save()
    .then((cat) => {
      res.status(200).json(cat);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

categoryRouter.get('/quizzes/:categoryID', (req, res) => {
  getCategoryQuizzes(req, res);
});

export default categoryRouter;

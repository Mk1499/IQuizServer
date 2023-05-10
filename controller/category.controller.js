import Category from '../models/category.js';
import Quiz from '../models/quiz.js';
import Submit from '../models/submit.js';
import { verifyToken } from '../utils/encryption.js';

export async function getCategoryQuizzesFiltered(req, res) {
  const category = req.params.categoryID;
  const lang = req.headers.lang;
  const token = req.headers.authorization;
  const userData = token ? verifyToken(token) : null;
  const userID = userData?._id;
  const submits = await Submit.find({ user: userID }, { _id: 0, quiz: 1 });
  const quizIDs = submits.map((item) => item.quiz);

  if (userID) {
    Quiz.find({
      _id: { $nin: quizIDs },
      category,
      // lang,
    })
      .populate('duration')
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } else {
    Quiz.find({
      category,
      // lang,
    })
      .populate('duration')
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
}

export async function getCategoryQuizzes(req, res) {
  const category = req.params.categoryID;
  const lang = req.headers.lang;

  Quiz.find({
    category,
    // lang,
  })
    .populate('duration')
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export async function listCategories(req, res) {
  Category.find({})
    .then((cats) => {
      res.status(200).json(cats);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

export async function addCategory(req, res) {
  const cat = new Category(req.body);
  cat
    .save()
    .then((cat) => {
      res.status(200).json(cat);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

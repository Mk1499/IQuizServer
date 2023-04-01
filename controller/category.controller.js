import Category from '../models/category.js';
import Quiz from '../models/quiz.js';

export async function getCategoryQuizzes(req, res) {
  const category = req.params.categoryID;
  const lang = req.headers.lang;
  Quiz.find({
    category,
    lang,
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

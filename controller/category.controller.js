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

import Answer from '../models/answer.js';

export async function addAnswer(req, res) {
  const a = new Answer(req.body);
  a.save()
    .then((ans) => {
      res.status(200).json(ans);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

export async function listAnswers(req, res) {
  Answer.find({})
    .then((answers) => {
      res.status(200).json(answers);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

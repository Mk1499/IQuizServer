import Question from '../models/question.js';

export async function listInCompleteQuestions(req, res) {
  Question.find({
    rightAnswer: {
      $exists: false,
    },
  })
    .populate('answers')
    .then((quetions) => {
      res.status(200).json(quetions);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export async function setRightAnswer(req, res) {
  const { questionID, answerID } = req.body;
  Question.updateOne(
    { _id: questionID },
    {
      rightAnswer: answerID,
    },
    {
      new: true,
    }
  )
    .then((q) => {
      res.status(200).send(q);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

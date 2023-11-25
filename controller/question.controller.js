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

export const getRondomQuestions = async () => {
  try {
    const randomQuestions = await Question.aggregate([
      { $sample: { size: 10 } }, // Get a random sample of 10 questions
      { $project: { _id: 1 } }, // Project only the _id field
    ]);

    const questionIds = randomQuestions.map((question) => question._id);

    return questionIds;
  } catch (error) {
    console.error('Error fetching random questions:', error);
    throw error;
  }
};

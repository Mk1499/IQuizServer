import Quiz from '../models/quiz.js';
import Question from '../models/question.js';
import Category from '../models/category.js';
import Duration from '../models/duration.js';

export async function addQuestionToQuiz(questionID, quizID, req, res) {
  const question = await Question.findById(questionID);
  console.log('QID : ', quizID);
  Quiz.findOneAndUpdate(
    {
      _id: quizID,
      questions: { $nin: [questionID] },
    },
    {
      $addToSet: {
        questions: questionID,
      },
      $inc: {
        points: question.points,
        noOfQuestions: 1,
      },
    }
  )
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(400).json({ message: 'question already added ' });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export async function getQuizPreData(req, res) {
  const categories = await Category.find({});
  const durations = await Duration.find({});
  res.status(200).json({
    categories,
    durations,
  });
}

export async function deleteQuiz(req, res) {
  const id = req.params.id;
  Quiz.deleteOne({ _id: id })
    .then(() => {
      res.status(200).send({
        message: 'Quiz Deleted',
      });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
}

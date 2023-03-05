import Quiz from '../models/quiz.js';
import Question from '../models/question.js';

export async function addQuestionToQuiz(questionID, quizID, req, res) {
  const question = await Question.findById(questionID);
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

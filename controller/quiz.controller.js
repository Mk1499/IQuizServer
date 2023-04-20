import Quiz from '../models/quiz.js';
import Question from '../models/question.js';
import Category from '../models/category.js';
import Duration from '../models/duration.js';
import Answer from '../models/answer.js';
import uuid from 'short-uuid';
import { verifyToken } from '../utils/encryption.js';
import axios from 'axios';

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
      console.log('add Q err : ', err);
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

export async function getQuizMetaData(req, res) {
  const id = req.params.id;
  Quiz.findById(id, { questions: 0 })
    .populate('duration category')
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send({ message: 'Quiz not fount' });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export async function joinByCode(req, res) {
  const code = req.params.code;
  Quiz.findOne({ code })
    .populate('duration category questions')
    .populate({
      path: 'questions',
      populate: 'answers',
    })
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send({ message: 'Quiz not fount' });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export async function addNewQuestion(req, res) {
  const { quizID, label, answers, rightAnswer, points } = req.body;
  const ans = await Answer.insertMany(answers);
  const ansIDs = ans.map((a) => a._id);
  const rightAnswerID = ans.find((a) => a.label === rightAnswer)?._id;
  const question = new Question({
    label,
    points,
    answers: ansIDs,
    rightAnswer: rightAnswerID,
  });
  question
    .save()
    .then((q) => {
      console.log('id : ', q._id);
      addQuestionToQuiz(q._id, quizID, req, res);
    })
    .catch((err) => {
      res.send(err);
    });
}

export async function addQuiz(req, res) {
  const token = req?.headers?.authorization;
  const userData = verifyToken(token);

  const {
    name,
    duration,
    category,
    lang,
    description,
    startDate,
    endDate,
    cover,
    status,
  } = req.body;
  let code = uuid.generate();
  const body = {
    name,
    duration,
    category,
    lang,
    description,
    code,
    startDate,
    endDate,
    questions: [],
    cover,
    status,
    user: userData?._id,
  };
  console.log('Body : ', body);

  const quiz = new Quiz(body);
  quiz.save((err, q) => {
    if (err) {
      console.log('mongo save err : ', err);
      res.status(400).send(err);
    } else {
      res.status(200).json(q);
    }
  });
  // .then((q) => {
  //   console.log('Q : ', q);
  //   // res.status(200).json(q);
  // })
  // .catch((err) => {
  //   console.log('Err : ', err);
  //   res.status(400).send(err);
  // });
}

export async function listQuizzes(req, res) {
  let lang = req.headers.lang;
  Quiz.find({ lang })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export async function latestQuizzes(req, res) {
  Quiz.find({
    status: 'Public',
  })
    .populate('user duration')
    .sort({
      createdAt: -1,
    })
    .limit(4)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

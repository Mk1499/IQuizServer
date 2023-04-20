import Answer from '../models/answer.js';
import Question from '../models/question.js';
import Quiz from '../models/quiz.js';
import axios from 'axios';
import uuid from 'short-uuid';
import { verifyToken } from '../utils/encryption.js';

export async function quizLandMaker(req, res) {
  const {
    quizLandID,
    duration,
    category,
    lang,
    startDate,
    endDate,
    cover,
    status,
  } = req.body;
  const quizLandMetaRes = await axios.get(
    `https://api.quizland.net/api/Quiz/${quizLandID}`
  );
  const quizLandMeta = quizLandMetaRes?.data;
  const code = uuid.generate();
  const token = req?.headers?.authorization;
  const userData = verifyToken(token);
  const quizLandQRes = await axios.get(
    `https://api.quizland.net/api/Quiz/${quizLandID}/stage`
  );
  const quizLandQuestions = quizLandQRes.data?.questions;

  const questions = quizLandQuestions?.map((q) => ({
    label: q.title,
    answers: q.answers.map((a) => ({ label: a.title })),
  }));

  const { qIDs, allPoints } = await addManyQuestions(questions);
  const quizBody = {
    name: quizLandMeta.title,
    duration,
    category,
    lang,
    description: quizLandMeta.description,
    code,
    questions: qIDs,
    noOfQuestions: qIDs?.length,
    cover:
      cover || `https://media.quizland.net/quiz/cover/${quizLandMeta.id}.jpg`,
    status: status || 'Public',
    user: userData?._id,
    points: allPoints,
    startDate,
    endDate,
  };

  const quiz = new Quiz(quizBody);
  quiz
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });

  //   res.json({ newQ });
}

async function addManyQuestions(questionsArr) {
  let allPoints = 1;
  if (questionsArr.length) {
    const questionsIDs = Promise.all(
      questionsArr.map(async (question) => {
        //   //   const answers = question.answers.map((ans) => ({ label: ans.title }));
        const ans = await Answer.insertMany(question.answers);
        const ansIDs = ans.map((a) => a._id);
        //   console.log('AnsIDs : ', ansIDs);
        const points = Math.floor(Math.random() * 2) + 1;
        allPoints += points;
        const q = new Question({
          label: question.label,
          points,
          answers: ansIDs,
        });
        const questionData = await q.save();
        // console.log('Q : ', questionData._id);
        return questionData._id;
      })
    );
    const qIDs = await questionsIDs;
    // console.log({ qIDs, allPoints });
    return { qIDs, allPoints };
    // return questionsIDs;
  } else {
    return [];
  }
}

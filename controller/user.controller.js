import Quiz from '../models/quiz.js';
import Submit from '../models/submit.js';
import User from '../models/user.js';
import { verifyToken } from '../utils/encryption.js';

export const updateRanks = async () => {
  const users = await User.find().sort({ points: -1 });

  let rank = 1;
  for (const user of users) {
    user.rank = rank;
    await user.save();
    rank++;
  }
};

export const setDeviceToken = async (req, res) => {
  const token = req?.headers?.authorization;
  const { deviceToken } = req.body;
  const userData = verifyToken(token);
  // console.log('Device Token : ', deviceToken);

  User.updateOne(
    {
      email: userData.email,
    },
    {
      $set: {
        deviceToken,
      },
    },
    {
      new: true,
    }
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

export const createdQuizzes = async (req, res) => {
  const userID = req.params?.id;
  Quiz.find({ user: userID })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await User.findById(id);
    const submittedQuizzes = await Submit.find(
      {
        user: id,
      },
      {
        submit: 0,
        user: 0,
      }
    )
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .populate('quiz')
      .populate({
        path: 'quiz',
        populate: 'duration',
      });

    res.status(200).json({
      userData,
      submittedQuizzes,
    });
  } catch (err) {
    console.log('E : ', err);
    res.status(400).send(err);
  }
};

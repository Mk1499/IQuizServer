import User from '../models/user.js';
import Quiz from '../models/quiz.js';
import Group from '../models/group.js';

export const generalSearch = async (req, res) => {
  try {
    const { query } = req.params;
    const users = await User.find({
      name: { $regex: new RegExp('.*' + query + '.*', 'i') },
    })
      .sort({ points: -1 })
      .limit(5);

    const quizzes = await Quiz.find({
      status: 'Public',
      name: { $regex: new RegExp('.*' + query + '.*', 'i') },
    }).limit(5);

    const groups = await Group.find({
      status: 'Public',
      title: { $regex: new RegExp('.*' + query + '.*', 'i') },
    }).limit(5);

    res.status(200).json({
      users,
      groups,
      quizzes,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

export const usersSearch = async (req, res) => {
  const { query } = req.params;
  User.find({
    name: { $regex: new RegExp('.*' + query + '.*', 'i') },
  })
    .sort({ points: -1 })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

export const quizzesSearch = async (req, res) => {
  const { query } = req.params;
  Quiz.find({
    status: 'Public',
    name: { $regex: new RegExp('.*' + query + '.*', 'i') },
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

export const groupSearch = async (req, res) => {
  const { query } = req.params;
  Group.find({
    status: 'Public',
    title: { $regex: new RegExp('.*' + query + '.*', 'i') },
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

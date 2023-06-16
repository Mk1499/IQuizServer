import User from '../models/user.js';
import Quiz from '../models/quiz.js';
import Group from '../models/group.js';

export const generalSearch = async (req, res) => {
  try {
    const { query } = req.params;
    const users = await User.find({
      name: { $regex: new RegExp('.*' + query + '.*', 'i') },
    }).limit(5);

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

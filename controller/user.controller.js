import Quiz from '../models/quiz.js';
import Submit from '../models/submit.js';
import User from '../models/user.js';
import Group from '../models/group.js';
import { verifyToken } from '../utils/encryption.js';
import { getUserFriends, isFriends } from './friendship.controller.js';
import { Types } from 'mongoose';

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
    const userData = await User.findById(id, { password: 0 });
    const token = req.headers.authorization;
    const senderUser = verifyToken(token);

    let friends = [];
    const friendship = await isFriends(
      new Types.ObjectId(id),
      new Types.ObjectId(senderUser._id)
    );
    if (!userData.profileLocked) {
      friends = await getUserFriends(userData._id);
    }
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

    const createdQuizzes = await Quiz.find({ user: id }).limit(5);
    const userGroups = await Group.find({
      users: { $elemMatch: { $eq: id } },
    })
      .limit(5)
      .populate('creator users');

    res.status(200).json({
      userData,
      submittedQuizzes,
      createdQuizzes,
      userGroups,
      friends,
      friendship,
    });
  } catch (err) {
    console.log('E : ', err);
    res.status(400).send(err);
  }
};
export const getMyProfile = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const senderUser = verifyToken(token);
    const id = senderUser?._id;
    const userData = await User.findById(id, { password: 0 });
    let friends = [];
    const friendship = await isFriends(
      new Types.ObjectId(id),
      new Types.ObjectId(senderUser._id)
    );
    friends = await getUserFriends(userData._id);
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

    const createdQuizzes = await Quiz.find({ user: id }).limit(5);
    const userGroups = await Group.find({
      users: { $elemMatch: { $eq: id } },
    })
      .limit(5)
      .populate('creator users');

    res.status(200).json({
      userData,
      submittedQuizzes,
      createdQuizzes,
      userGroups,
      friends,
      friendship,
    });
  } catch (err) {
    console.log('E : ', err);
    res.status(400).send(err);
  }
};

export const lockProfile = async (req, res) => {
  const token = req?.headers?.authorization;
  const userData = verifyToken(token);
  const id = userData._id;
  User.updateOne(
    { _id: id },
    {
      $set: {
        profileLocked: true,
      },
    }
  )
    .then(() => {
      res.status(200).json({ message: 'ProfileLockedSuccessfully' });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

export const unlockProfile = async (req, res) => {
  const token = req?.headers?.authorization;
  const userData = verifyToken(token);
  const id = userData._id;
  User.updateOne(
    { _id: id },
    {
      $set: {
        profileLocked: false,
      },
    }
  )
    .then(() => {
      res.status(200).json({ message: 'ProfileUnLockedSuccessfully' });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

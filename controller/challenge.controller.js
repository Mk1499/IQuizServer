// import { io } from '../app.js';
import Challenge from '../models/challenge.js';
import socketEvents from '../utils/socketEvents.js';
import { getRondomQuestions } from './question.controller.js';

export const checkPendingChallenge = async (userId) => {
  const pendingChallenge = await Challenge.findOne({ status: 'pending' });
  if (pendingChallenge) {
    return userJoinsChallenge(userId, pendingChallenge._id);
  } else {
    return createChallenge(userId);
  }
};

const createChallenge = async (userId) => {
  const questions = await getRondomQuestions();
  const challenge = new Challenge({
    participants: [userId],
    questions,
    endTime: new Date('2024-12-23'),
    status: 'pending',
  });
  const challengeData = await challenge.save();
  const channel = realtime.channels.get(challengeData._id);
  // const roomName = `challenge_${challengeData._id}`;
  // socket.join(roomName);
  // io.to(socket.id).emit(socketEvents.challengeCreated, challengeData);
  return challengeData;
};

const userJoinsChallenge = async (userId, challengeId) => {
  const roomName = `challenge_${challengeId}`;
  // socket.join(roomName);
  const challengeData = await Challenge.findOneAndUpdate(
    { _id: challengeId },
    {
      $set: { status: 'active' },
      $addToSet: {
        participants: userId,
      },
    },
    {
      new: true,
    }
  )
    .populate('participants questions')
    .populate({
      path: 'questions',
      populate: 'answers',
    });
  console.log('challengeData : ', challengeData);
  // io.to(roomName).emit(socketEvents.compeleteChallenge, challengeData);
};

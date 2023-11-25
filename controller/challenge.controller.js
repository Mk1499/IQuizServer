import { io } from '../app.js';
import Challenge from '../models/challenge.js';
import socketEvents from '../utils/socketEvents.js';
import { getRondomQuestions } from './question.controller.js';

export const checkPendingChallenge = async (socket, userId) => {
  const pendingChallenge = await Challenge.findOne({ status: 'pending' });
  if (pendingChallenge) {
    userJoinsChallenge(socket, userId, pendingChallenge._id);
  } else {
    createChallenge(socket, userId);
  }
};

const createChallenge = async (socket, userId) => {
  const questions = await getRondomQuestions();
  const challenge = new Challenge({
    participants: [userId],
    questions,
    endTime: new Date('2023-12-23'),
    status: 'pending',
  });
  const challengeData = await challenge.save();
  const roomName = `challenge_${challengeData._id}`;
  socket.join(roomName);
  io.to(socket.id).emit(socketEvents.challengeCreated, challengeData);
  return challengeData;
};

const userJoinsChallenge = async (socket, userId, challengeId) => {
  const roomName = `challenge_${challengeId}`;
  socket.join(roomName);
  const challengeData = await Challenge.findOneAndUpdate(
    { _id: challengeId },
    {
      $set: { status: 'active' },
      $addToSet: {
        participants: userId,
      },
    }
  ).populate('participants');
  console.log('challengeData : ', challengeData);
  io.to(roomName).emit(socketEvents.compeleteChallenge, challengeData);
};

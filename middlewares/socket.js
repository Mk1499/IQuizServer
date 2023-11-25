import { checkPendingChallenge } from '../controller/challenge.controller.js';
import { getRondomQuestions } from '../controller/question.controller.js';
import Challenge from '../models/challenge.js';
import Question from '../models/question.js';
import socketEvents from '../utils/socketEvents.js';

export const onConnection = (socket) => {
  console.log('user connected : ', socket.id);
  socket.on(socketEvents.startChallange, async (userId) => {
    console.log('user id : ', userId);
    checkPendingChallenge(socket, userId);
  });
};

import { checkPendingChallenge } from '../controller/challenge.controller.js';
import { getRondomQuestions } from '../controller/question.controller.js';
import Challenge from '../models/challenge.js';
import Question from '../models/question.js';
import socketEvents from '../utils/socketEvents.js';
import Ably from 'ably';
import ChannelNames from '../utils/channelsNames.js';

// Using promises
const realtime = new Ably.Realtime.Promise({ key: process.env.ablyKey });

const channel = realtime.channels.get('get-started');

channel.subscribe((data) => {
  console.log('ABLY : ', data);
  if (data.name === ChannelNames.challengeRequest) {
    channel.publish(data.data.user, 'hello from server');
  }
});

channel.on('failed', (data) => {
  console.log('d : ', data);
});

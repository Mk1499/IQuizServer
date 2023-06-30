import express from 'express';
import mongoose from 'mongoose';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import AnswersRouter from './routes/answer.js';
import QuestionRouter from './routes/questions.js';
import env from 'dotenv';
import DurationRouter from './routes/duration.js';
import CategoryRouter from './routes/category.js';
import quizRouter from './routes/quiz.js';
import helmet from 'helmet';
import userRouter from './routes/user.js';
import feedbackRouter from './routes/feedback.js';
import submitRouter from './routes/submit.js';
import groupRouter from './routes/group.routes.js';
import searchRouter from './routes/search.routes.js';
import friendshipRouter from './routes/friendship.routes.js';

import { updateRanks } from './controller/user.controller.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
env.config();
app.use(cors());
app.use(helmet());
mongoose.connect(process.env.DBConnect);

mongoose.connection.once('open', async () => {
  console.log('connected to Database');
});

app.get('/', (req, res) => {
  updateRanks();
  res.send('Welcome To IQuiz Server');
});

app.use('/answer', AnswersRouter);
app.use('/question', QuestionRouter);
app.use('/duration', DurationRouter);
app.use('/category', CategoryRouter);
app.use('/quiz', quizRouter);
app.use('/user', userRouter);
app.use('/feedback', feedbackRouter);
app.use('/submit', submitRouter);
app.use('/group', groupRouter);
app.use('/search', searchRouter);
app.use('/friend', friendshipRouter);

const options = {
  key: fs.readFileSync('./config/server.key'),
  cert: fs.readFileSync('./config/server.cert'),
};

const port = process.env.PORT || 9000;

// app.post('/', (req, res) => {
//   res.send(req.body);
// });

// https.createServer(options, app).listen(port, () => {
//   console.log(`HTTPS server started on port : `, port);
// });

app.listen(port, () => {
  console.log(' server starts on port : ', port);
});

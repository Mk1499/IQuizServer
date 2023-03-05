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

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
env.config();
app.use(cors());
mongoose.connect(process.env.DBConnect);

mongoose.connection.once('open', () => {
  console.log('connected to Database');
});

app.use('/answer', AnswersRouter);
app.use('/question', QuestionRouter);
app.use('/duration', DurationRouter);
app.use('/category', CategoryRouter);
app.use('/quiz', quizRouter);

const options = {
  key: fs.readFileSync('./config/server.key'),
  cert: fs.readFileSync('./config/server.cert'),
};

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('ssss');
});

app.post('/', (req, res) => {
  res.send(req.body);
});

https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS server started on port : `, port);
});

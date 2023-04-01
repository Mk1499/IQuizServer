import express, { response } from 'express';
import {
  addDuration,
  deleteDuration,
  listDurations,
} from '../controller/duration.controller.js';
import Duration from '../models/duration.js';

const durationRouter = express.Router();

durationRouter.get('/', (req, res) => {
  listDurations(req, res);
});

durationRouter.post('/add', (req, res) => {
  addDuration(req, res);
});

durationRouter.delete('/remove', (req, res) => {
  deleteDuration(req, res);
});

export default durationRouter;

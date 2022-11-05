import express, { response } from 'express';
import Duration from '../models/duration.js';

const durationRouter = express.Router();

durationRouter.get('/', (req, res) => {
  Duration.find({})
    .then((d) => {
      res.status(200).json(d);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

durationRouter.post('/add', (req, res) => {
  const d = new Duration(req.body);
  d.save()
    .then((duration) => {
      res.status(200).json(duration);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

durationRouter.delete('/remove', (req, res) => {
  Duration.deleteOne({ _id: req.body.id })
    .then(() => {
      res.status(200).json({ message: 'Duration Deleted' });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

export default durationRouter;

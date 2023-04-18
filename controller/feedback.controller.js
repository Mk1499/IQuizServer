import Feedback from '../models/feedback.js';

export async function addFeedback(req, res) {
  const f = new Feedback(req.body);
  f.save()
    .then((feedback) => {
      res.status(200).json(feedback);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

export async function listFeedbacks(req, res) {
  Feedback.find({})
    .sort({ createdAt: -1 })
    .populate('user')
    .then((feedbacks) => {
      res.status(200).json(feedbacks);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
}

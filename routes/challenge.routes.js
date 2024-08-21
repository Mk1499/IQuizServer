import express from 'express';
import { checkPendingChallenge } from '../controller/challenge.controller.js';

const challengeRouter = express.Router();

challengeRouter.post('/request', async (req, res) => {
  const { userID } = req.body;
  if (userID) {
    const data = await checkPendingChallenge(userID);
    res.status(200).json({ data });
  } else {
    res.status(400).json({ message: 'No User ID received' });
  }
});

export default challengeRouter;

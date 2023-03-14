import express from 'express';
import User from '../models/user.js';
import { verifyEmail } from '../middlewares/user.js';
import { doublicatedKeyRegister } from '../utils/errorHandling.js';
import { signingData } from '../utils/encryption.js';
import ErrorMessages from '../utils/errorMessages.js';
import { codeGeneration } from '../utils/generate.js';

const userRouter = express.Router();

userRouter.post('/register', verifyEmail, (req, res) => {
  const { name, email, photo, password, socialID } = req.body;
  const code = codeGeneration();
  if (password || socialID) {
    const user = new User({
      name,
      email,
      photo,
      password,
      socialID,
      code,
    });

    user
      .save()
      .then((data) => {
        let securedData = data;
        delete securedData['password'];
        const token = signingData(securedData);
        res.status(200).json(token);
      })
      .catch((err) => {
        doublicatedKeyRegister(err, res);
      });
  } else {
    res.status(400).json({
      code: 410,
      message: 'You must register with password or with social id',
    });
  }
});

userRouter.post('/login', verifyEmail, (req, res) => {
  const { email, password, socialID } = req.body;
  if (password) {
    User.findOne(
      {
        email,
        password,
      },
      { email: 1, photo: 1, name: 1, points: 1, role: 1 }
    )
      .then((data) => {
        if (data) {
          const token = signingData(data);
          res.status(200).json(token);
        } else {
          res.status(404).json({
            message: ErrorMessages.noUser,
          });
        }
      })
      .catch((err) => {
        console.log(('E : ', err));
        res.status(400).json(err);
      });
  } else if (socialID) {
    User.findOne(
      {
        email,
        socialID,
      },
      { email: 1, photo: 1, name: 1, points: 1, role: 1 }
    )
      .then((data) => {
        if (data) {
          const token = signingData(data);
          res.status(200).json(token);
        } else {
          res.status(404).json({
            message: ErrorMessages.noUser,
          });
        }
      })
      .catch((err) => {
        console.log(('E : ', err));
        res.status(400).json(err);
      });
  } else {
    res.status(404).json({
      message: ErrorMessages.noPassOrSocialID,
    });
  }
});

export default userRouter;

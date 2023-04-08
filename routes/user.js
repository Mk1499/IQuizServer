import express from 'express';
import User from '../models/user.js';
import {
  adminAuthorization,
  authorization,
  isMine,
  verifyEmail,
} from '../middlewares/user.js';
import { doublicatedKeyRegister } from '../utils/errorHandling.js';
import { signingData, verifyToken } from '../utils/encryption.js';
import ErrorMessages from '../utils/errorMessages.js';
import { codeGeneration } from '../utils/generate.js';
import { sendEmail } from '../utils/sendEmail.js';
import Jwt from 'jsonwebtoken';

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
        sendEmail(email, code);
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
  const { email, password } = req.body;

  User.findOne(
    {
      email,
      password,
    },
    { email: 1, photo: 1, name: 1, points: 1, role: 1, verified: 1 }
  )
    .then((data) => {
      if (data) {
        const token = signingData(data);
        if (!data.verified) {
          sendEmail(email, data?.code);
        }

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
});

userRouter.post('/googleLogin', verifyEmail, async (req, res) => {
  const { email, socialID, name, photo } = req.body;
  try {
    const socialUser = await User.findOne(
      { email, socialID },
      { email: 1, photo: 1, name: 1, points: 1, role: 1 }
    );
    if (socialUser) {
      const token = signingData(socialUser);
      res.status(200).json(token);
    } else {
      const prevUserWithEmail = await User.findOne(
        { email },
        { email: 1, photo: 1, name: 1, points: 1, role: 1 }
      );
      if (prevUserWithEmail) {
        const userUpdated = await User.updateOne(
          { email },
          {
            $set: {
              socialID,
            },
          }
        );
        const token = signingData(prevUserWithEmail);
        res.status(200).json(token);
      } else {
        let user = new User({
          name,
          photo,
          email,
          socialID,
        });
        const newUser = await user.save();
        const token = signingData(prevUserWithEmail);
        res.status(200).json(token);
      }
    }
  } catch (err) {
    res.status(400).send(err);
  }

  // User.findOne(
  //   {
  //     email,
  //     socialID,
  //   },
  //   { email: 1, photo: 1, name: 1, points: 1, role: 1 }
  // )
  //   .then((data) => {
  //     if (data) {
  //       const token = signingData(data);
  //       res.status(200).json(token);
  //     } else {
  //       let prevUser = await User.findOne({ email });
  //       if (prevUser) {
  //         User.updateOne({ email }, { $set: { socialID } });
  //       }

  // let user = new User({
  //   name,
  //   photo,
  //   email,
  //   socialID,
  // });
  //       user
  //         .save()
  //         .then((userData) => {
  //           let securedData = userData;
  //           delete securedData['password'];
  //           const token = signingData(securedData);
  //           res.status(200).json(token);
  //         })
  //         .catch((err) => {
  //           doublicatedKeyRegister(err, res);
  //         });
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(('E : ', err));
  //     res.status(400).json(err);
  //   });
});

userRouter.get('/resendCode', authorization, (req, res) => {
  const token = req.headers.authorization;
  const userData = Jwt.decode(token);
  const newCode = codeGeneration();
  User.findOneAndUpdate({ _id: userData._id }, { $set: { code: newCode } })
    .then(() => {
      sendEmail(userData.email, newCode);
      res.status(200).json({ message: 'Code Sent' });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
  console.log('Token : ', newCode);
});

userRouter.post('/verifyEmail', authorization, async (req, res) => {
  const token = req.headers.authorization;
  const userData = Jwt.decode(token);
  const code = req.body.code;
  User.findById(userData._id)
    .then((user) => {
      if (user.code === code) {
        User.updateOne(
          { _id: userData._id },
          {
            $set: {
              verified: true,
            },
          }
        )
          .then(() => {
            res.status(200).json({
              message: 'User Verified',
            });
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        res.status(400).json({ message: ErrorMessages.wrongCode });
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

userRouter.post('/forgotPassword', (req, res) => {
  const email = req.body?.email;
  User.findOne({ email })
    .then((userData) => {
      if (userData) {
        sendEmail(email, userData.code);
      }
      res.status(200).json({ message: 'Code Sent' });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

userRouter.post('/verifyCode', (req, res) => {
  const { email, code } = req.body;
  User.findOne({ email }, { name: 1, email: 1, code: 1 })
    .then((userData) => {
      const token = signingData(userData);
      if (userData.code === code) {
        res.status(200).json({ message: 'success', token });
      } else {
        res.status(400).json({ message: ErrorMessages.wrongCode });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: ErrorMessages.wrongCode });
    });
});

userRouter.post('/resetPassword', authorization, (req, res) => {
  const token = req.headers.authorization;
  const userData = Jwt.decode(token);
  const { newPassword } = req.body;
  User.findOneAndUpdate(
    { _id: userData._id },
    {
      $set: {
        password: newPassword,
      },
    }
  )
    .then(() => {
      res.status(200).json({ message: 'passwordUpdated' });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

userRouter.put('/update', authorization, (req, res) => {
  const { name, photo } = req.body;
  const token = req.headers.authorization;
  const user = verifyToken(token);
  User.findByIdAndUpdate(
    { _id: user._id },
    { $set: { name, photo } },
    { new: true }
  )
    .then((data) => {
      const token = signingData(data);

      res.status(200).json({ message: 'userUpdated', token });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

userRouter.get('/sync/:id', isMine, async (req, res) => {
  const id = req.params?.id;
  const data = await User.findById(id);
  if (data) {
    let token = signingData(data);
    res.status(200).json(token);
  } else {
    res.status(400).json({ message: ErrorMessages.noUser });
  }
});

userRouter.get('/list', authorization, adminAuthorization, async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

export default userRouter;

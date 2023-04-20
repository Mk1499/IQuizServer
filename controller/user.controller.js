import User from '../models/user.js';
import { verifyToken } from '../utils/encryption.js';

export const updateRanks = async () => {
  const users = await User.find().sort({ points: -1 });

  let rank = 1;
  for (const user of users) {
    user.rank = rank;
    await user.save();
    rank++;
  }
};

export const setDeviceToken = async (req, res) => {
  const token = req?.headers?.authorization;
  const { deviceToken } = req.body;
  const userData = verifyToken(token);
  console.log('Device Token : ', deviceToken);

  User.updateOne(
    {
      email: userData.email,
    },
    {
      $set: {
        deviceToken,
      },
    },
    {
      new: true,
    }
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

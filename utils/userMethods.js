import User from '../models/user.js';

const updateRanks = async () => {
  const users = await User.find().sort({ points: -1 });

  let rank = 1;
  for (const user of users) {
    user.rank = rank;
    await user.save();
    rank++;
  }
};

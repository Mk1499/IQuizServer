import User from '../models/user.js';

export const generalSearch = async (req, res) => {
  const { query } = req.params;
  const users = await User.find({
    name: { $regex: new RegExp('.*' + query + '.*', 'i') },
  }).limit(5);
  try {
    res.status(200).json({
      users,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

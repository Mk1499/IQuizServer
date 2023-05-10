import Group from '../models/group.js';
import { verifyToken } from '../utils/encryption';

export const createGroup = (req, res) => {
  const { title } = req.body;
  const token = req?.headers?.authorization;
  const userData = verifyToken(token);

  const group = new Group({
    title,
    creator: userData._id,
  });

  group
    .save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

export const getGroupDetails = (req, res) => {};

export const updateGroupName = (req, res) => {
  const { groupID, title } = req.body;
  Group.updateOne({ _id: groupID }, { $set: { title } }, { upsert: true })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

export const listAllGroups = (req, res) => {
  Group.find({})
    .populate('creator users')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

export const listUserGroups = (req, res) => {
  const token = req?.headers?.authorization;
  const userData = verifyToken(token);

  Group.find({ users: { $elemMatch: { $eq: userData._id } } })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

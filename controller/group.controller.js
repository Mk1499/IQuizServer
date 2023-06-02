import uuid from 'short-uuid';
import Group from '../models/group.js';
import { verifyToken } from '../utils/encryption.js';

export const createGroup = (req, res) => {
  const { title } = req.body;
  const token = req?.headers?.authorization;
  const userData = verifyToken(token);
  const code = uuid.generate();

  const group = new Group({
    title,
    creator: userData._id,
    code,
    users: [userData._id],
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

export const getGroupDetails = (req, res) => {
  const { id } = req.params;
  Group.findById(id)
    .populate('creator users')

    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

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
    .populate('creator users')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

export const deleteGroup = (req, res) => {
  const { id } = req.params;
  Group.deleteOne({ _id: id })
    .then(() => {
      res.status(200).json({ message: 'Group Deleted' });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

export const joinToGroup = (req, res) => {
  const token = req?.headers?.authorization;
  const userData = verifyToken(token);
  const { code, userID } = req.body;
  Group.updateOne(
    { code },
    {
      $addToSet: {
        users: userID ? userID : userData._id,
      },
    },
    {
      upsert: true,
    }
  )
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

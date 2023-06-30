import Friendship from '../models/friendship.js';
import { verifyToken } from '../utils/encryption.js';
import { createNotification } from './notification.controller.js';

export async function sendFriendRequest(req, res) {
  const { userID, userPushID, userSenderName, userSenderPhoto } = req.body;
  const token = req.headers.authorization;
  const userData = verifyToken(token);

  const friendRequest = new Friendship({
    users: [userData._id, userID],
    from: userData._id,
    to: userID,
  });
  const title = 'طلب صداقة جديد';
  const body = `قام ${userSenderName} بأرسال طلب صداقة اليك`;
  const type = 'friendRequest';

  friendRequest
    .save()
    .then(() => {
      try {
        createNotification(
          userID,
          title,
          body,
          type,
          userPushID,
          userSenderPhoto
        );
      } catch (err) {
        console.log('ERR : ', err);
        throw err;
      }
      res.status(200).json({ message: 'Friend Request Sent' });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export async function acceptFriendRequest(req, res) {
  const { friendshipID } = req.body;
  const friendship = await Friendship.findById(friendshipID).populate(
    'from to'
  );
  const senderUser = friendship.from;
  const recieverUser = friendship.to;
  const title = 'تم قبول طلب الصداقة';
  const body = `قام ${recieverUser.name} بقبول طلب الصداقة`;
  const type = 'friendAccepted';
  const notePhoto = recieverUser.photo;
  Friendship.updateOne({ _id: friendshipID }, { $set: { status: 'valid' } })
    .then(() => {
      createNotification(
        senderUser._id,
        title,
        body,
        type,
        senderUser.deviceToken,
        notePhoto
      );
      res.status(200).json({ message: 'Friend Request Accepted' });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export async function removeFriendRequest(req, res) {
  const { friendshipID } = req.body;
  Friendship.deleteOne({ _id: friendshipID })
    .then(() => {
      res.status(200).json({ message: 'Friendship Deleted !!!' });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export async function listUserFriends(req, res) {
  const { userID } = req.params;
  Friendship.find({ users: { $in: [userID] } })
    .populate('users')
    .then((data) => {
      //   const friend = data.users.find((item) => item._id !== userID);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export async function getUserFriends(userID) {
  const data = await Friendship.find({
    users: userID,
    status: 'valid',
  }).populate('users');
  const friends = data.map((item) => {
    const friend = item.users.find((u) => u._id !== userID);
    return friend;
  });
  return friends;
}

export async function getUserPendingFriends(req, res) {
  const token = req.headers.authorization;
  const user = verifyToken(token);
  Friendship.find({
    to: user?._id,
    status: 'pending',
  })
    .populate('from')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export async function isFriends(user1, user2) {
  const friendship = await Friendship.findOne({
    $or: [
      {
        from: user1,
        to: user2,
      },
      {
        from: user2,
        to: user1,
      },
    ],
  });
  if (friendship) {
    return friendship;
  } else {
    return null;
  }
}

// Admin

export async function listAllFriendShips(req, res) {
  Friendship.find({})
    .populate('from to users')
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

export function clearAllRequests(req, res) {
  Friendship.deleteMany({})
    .then(() => {
      res.status(200).send('All Reqests Cleared');
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

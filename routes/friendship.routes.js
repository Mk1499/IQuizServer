import express from 'express';
import {
  acceptFriendRequest,
  clearAllRequests,
  getUserPendingFriends,
  listAllFriendShips,
  listUserFriends,
  removeFriendRequest,
  sendFriendRequest,
} from '../controller/friendship.controller.js';
import { adminAuthorization, authorization } from '../middlewares/user.js';

const friendshipRouter = express.Router();

friendshipRouter.post('/add', authorization, (req, res) => {
  sendFriendRequest(req, res);
});

friendshipRouter.post('/accept', authorization, (req, res) => {
  acceptFriendRequest(req, res);
});

friendshipRouter.delete('/remove', authorization, (req, res) => {
  removeFriendRequest(req, res);
});

friendshipRouter.get('/list/:userID', authorization, (req, res) => {
  listUserFriends(req, res);
});

friendshipRouter.get('/pendingRequests', authorization, (req, res) => {
  getUserPendingFriends(req, res);
});
friendshipRouter.get('/listAll', adminAuthorization, (req, res) => {
  listAllFriendShips(req, res);
});
friendshipRouter.delete('/clearAll', adminAuthorization, (req, res) => {
  clearAllRequests(req, res);
});

export default friendshipRouter;

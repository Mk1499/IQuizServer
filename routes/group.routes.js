import express from 'express';
import {
  createGroup,
  deleteGroup,
  getGroupDetails,
  joinToGroup,
  listAllGroups,
  listUserGroups,
} from '../controller/group.controller.js';
import {
  adminAuthorization,
  authorization,
  isMine,
} from '../middlewares/user.js';

const groupRouter = express.Router();

groupRouter.post('/add', authorization, (req, res) => {
  createGroup(req, res);
});

groupRouter.get('/', adminAuthorization, (req, res) => {
  listAllGroups(req, res);
});

groupRouter.get('/listMyGroups', authorization, (req, res) => {
  listUserGroups(req, res);
});

groupRouter.delete('/delete/:id', isMine, (req, res) => {
  deleteGroup(req, res);
});

groupRouter.post('/join', authorization, (req, res) => {
  joinToGroup(req, res);
});

groupRouter.get('/:id', authorization, (req, res) => {
  getGroupDetails(req, res);
});

export default groupRouter;

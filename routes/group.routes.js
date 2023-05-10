import express from 'express';
import { createGroup, listAllGroups } from '../controller/group.controller.js';
import { adminAuthorization, authorization } from '../middlewares/user.js';

const groupRouter = express.Router();

groupRouter.post('/add', authorization, (req, res) => {
  createGroup(req, res);
});

groupRouter.get('/', adminAuthorization, (req, res) => {
  listAllGroups(req, res);
});

export default groupRouter;

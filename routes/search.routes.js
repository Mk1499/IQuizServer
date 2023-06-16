import express from 'express';
import { generalSearch } from '../controller/search.controller.js';

const searchRouter = express.Router();

searchRouter.get('/general/:query', (req, res) => {
  generalSearch(req, res);
});

export default searchRouter;

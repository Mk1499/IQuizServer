import ErrorMessages from '../utils/errorMessages.js';
import { verifyToken } from '../utils/encryption.js';

const mailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

export const verifyEmail = (req, res, next) => {
  const { email } = req.body;

  if (mailRegex.test(email)) {
    next();
  } else {
    res.status(400).send({
      message: ErrorMessages.inValidEmail,
    });
  }
};

export const authorization = (req, res, next) => {
  const token = req?.headers?.authorization;
  if (!token) {
    res.status(400).send({ message: ErrorMessages.notAuthorized });
  } else {
    let data = verifyToken(token);
    if (data) {
      next();
    } else {
      res.status(400).send({ message: ErrorMessages.notValidToken });
    }
  }
};

export const isMine = (req, res, next) => {
  const token = req?.headers?.authorization;
  const id = req?.params?.id;
  if (!token) {
    res.status(400).send({ message: ErrorMessages.notAuthorized });
  } else {
    let data = verifyToken(token);
    if (data && (data._id === id || data.role === 'admin')) {
      next();
    } else {
      res.status(400).send({ message: ErrorMessages.accessOtherUserData });
    }
  }
};

export const adminAuthorization = (req, res, next) => {
  const token = req?.headers?.authorization;
  if (!token) {
    res.status(400).send({ message: ErrorMessages.notAuthorized });
  } else {
    let data = verifyToken(token);
    if (data && data.role === 'admin') {
      next();
    } else {
      res.status(400).send({ message: ErrorMessages.mustBeAdmin });
    }
  }
};

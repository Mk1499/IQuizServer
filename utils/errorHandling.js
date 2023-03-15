import ErrorMessages from './errorMessages.js';

export const doublicatedKeyRegister = (err, res) => {
  let message = '';
  if (err?.code === 11000 && err?.keyPattern) {
    try {
      const doublicated = Object.keys(err?.keyPattern)[0];
      switch (doublicated) {
        case 'email':
          message = ErrorMessages.duplicatedEmail;
          break;
        case 'socialID':
          message = ErrorMessages.duplicatedSocialID;
          break;
      }
      if (message) {
        res.status(400).send({ message });
      } else {
        throw 'Not Counted';
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(err);
    }
  }
};

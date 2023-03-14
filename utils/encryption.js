import fs from 'fs';
import JWT from 'jsonwebtoken';

export const signingData = (data) => {
  const privateKey = fs.readFileSync('config/private.key');
  const dataStr = JSON.stringify(data);
  const encData = JWT.sign(dataStr, privateKey, { algorithm: 'RS256' });
  return encData;
};

export const verifyToken = (token) => {
  const privateKey = fs.readFileSync('config/private.key');
  return JWT.verify(token, privateKey);
};

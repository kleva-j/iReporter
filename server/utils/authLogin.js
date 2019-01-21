/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import { sendFileResponse } from './sanitizer';

const authToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return sendFileResponse(res, 'login', 401);
  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, response) => {
    if (err) return sendFileResponse(res, 'login', 401);
    req.auth = response;
    return next();
  });
};

export default authToken;

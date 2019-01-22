/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';

const authToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      status: 401,
      message: 'You are required to signup or login to access this endpoint',
    });
  }
  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, response) => {
    if (err) {
      return res.status(401).json({
        status: 401,
        message: 'failed to authenticate',
      });
    }
    req.auth = response;
    return next();
  });
};

export default authToken;

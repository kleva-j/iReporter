import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export default (req, res, next) => {
  const token = req.headers['x-access-token'] || req.body.token || req.query.token;
  if (!token) res.status(401).jsend.fail({ messsage: 'You are required to login to access this' });
  else {
    jwt.verify(token, process.env.SECRET, (err, response) => {
      if (err) res.status(401).jsend.fail({ message: 'failed to authenticate' });
      req.auth = response;
      next();
    });
  }
};

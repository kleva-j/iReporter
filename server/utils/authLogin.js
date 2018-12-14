import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const authToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.body.token || req.query.token;
  if (!token) {
    return res.status(401).json({
      status: 401,
      message: 'You are required to login to access this endpoint',
    });
  }
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

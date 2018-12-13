import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const authToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.body.token || req.query.token;
  if (!token) {
    res.status(401).json({
      status: 401,
      messsage: 'You are required to login to access this endpoint',
    });
  } else {
    jwt.verify(token, process.env.SECRET, (err, response) => {
      if (err) {
        res.status(401).json({
          status: 401,
          message: 'failed to authenticate',
        });
      }

      req.auth = response;
      next();
    });
  }
};

export default authToken;

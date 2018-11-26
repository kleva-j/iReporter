import express from 'express';
import path from 'path';
import userController from '../controllers/userController';
import userValidator from '../utils/userValidator';

const {
  validateLogin,
  validateSignup,
} = userValidator;

const {
  RegisterUser,
  LoginUser,
} = userController;

const userRouter = express.Router();

userRouter.route('/login')
  .get((req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'template', 'html', 'login.html'));
  })
  .post(validateLogin, LoginUser);

userRouter.route('/signup')
  .get((req, res) => {
    res.status(200).sendFile(path.join(__dirname, '..', '..', 'template', 'html', 'signup.html'));
  })
  .post(validateSignup, RegisterUser);


export default userRouter;

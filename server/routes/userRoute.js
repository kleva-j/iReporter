import { Router } from 'express';
import { sendFileResponse } from '../utils/sanitizer';
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

const userRouter = Router();

userRouter.route('/login')
  .get((req, res) => sendFileResponse(res, 'login', 200))
  .post(validateLogin, LoginUser);

userRouter.route('/signup')
  .get((req, res) => sendFileResponse(res, 'signup', 200))
  .post(validateSignup, RegisterUser);

userRouter.route('/profile')
  .get((req, res) => sendFileResponse(res, 'profile', 200));

export default userRouter;

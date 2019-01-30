import { Router } from 'express';
import { sendFileResponse } from '../utils/sanitizer';
import userController from '../controllers/userController';
import userValidator from '../utils/userValidator';

const {
  validateLogin,
  validateSignup,
  AuthSignupInputLength,
} = userValidator;

const {
  RegisterUser,
  LoginUser,
} = userController;

const userRouter = Router();

// users
userRouter.route('/login')
  .get((req, res) => sendFileResponse(res, 'login', 200))
  .post(validateLogin, LoginUser);

userRouter.route('/signup')
  .get((req, res) => sendFileResponse(res, 'signup', 200))
  .post(validateSignup, AuthSignupInputLength, RegisterUser);

userRouter.route('/profile')
  .get((req, res) => sendFileResponse(res, 'profile', 200));

// admin
userRouter.route('/admin/login')
  .get((req, res) => sendFileResponse(res, 'adminLogin', 200, 'admin'));

export default userRouter;

import { Router } from 'express';
import { sendFileResponse } from '../utils/sanitizer';
import userController from '../controllers/userController';
import authToken from '../utils/authLogin';
import { validateLogin, validateSignup, returnValidationErrors } from '../utils/userValidator';

const {
  RegisterUser,
  LoginUser,
  getUserProfile,
} = userController;

const userRouter = Router();

// users
userRouter.route('/login')
  .get((req, res) => sendFileResponse(res, 'login', 200))
  .post(validateLogin, returnValidationErrors, LoginUser);

userRouter.route('/signup')
  .get((req, res) => sendFileResponse(res, 'signup', 200))
  .post(validateSignup, returnValidationErrors, RegisterUser);

userRouter.route('/profile')
  .get((req, res) => sendFileResponse(res, 'profile', 200));

userRouter.route('/userprofile')
  .get(authToken, getUserProfile);

// admin
userRouter.route('/admin/login')
  .get((req, res) => sendFileResponse(res, 'adminLogin', 200, 'admin'));

export default userRouter;

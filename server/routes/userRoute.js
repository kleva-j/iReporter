import { Router } from 'express';
import userController from '../controllers/userController';
import userValidator from '../utils/userValidator';

const {
  validateLogin,
  validateSignup,
} = userValidator;

const {
  RegisterUser,
  LoginUser,
  getAllUsers,
} = userController;

const userRouter = Router();

userRouter.route('/login')
  .post(validateLogin, LoginUser);

userRouter.route('/signup')
  .post(validateSignup, RegisterUser);

userRouter.route('/users')
  .get(getAllUsers);

export default userRouter;

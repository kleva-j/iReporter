import express from 'express';
import userController from '../controllers/userController';

const {
  RegisterUser,
  LoginUser,
} = userController;

const userRouter = express.Router();

userRouter.route('/login')
  .post(LoginUser);
userRouter.route('/signup')
  .post(RegisterUser);

export default userRouter;

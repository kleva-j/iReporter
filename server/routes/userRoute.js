const express = require('express');
const userController = require('../controllers/userController');
const userValidator = require('../utils/userValidator');

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
  .post(validateLogin, LoginUser);

userRouter.route('/signup')
  .post(validateSignup, RegisterUser);

module.exports = userRouter;

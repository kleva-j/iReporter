'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _userController = require('../controllers/userController');

var _userController2 = _interopRequireDefault(_userController);

var _userValidator = require('../utils/userValidator');

var _userValidator2 = _interopRequireDefault(_userValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validateLogin = _userValidator2.default.validateLogin,
    validateSignup = _userValidator2.default.validateSignup;
var RegisterUser = _userController2.default.RegisterUser,
    LoginUser = _userController2.default.LoginUser;


var userRouter = _express2.default.Router();

userRouter.route('/login').get(function (req, res) {
  res.status(200).sendFile(_path2.default.join(__dirname, '..', '..', 'template', 'html', 'login.html'));
}).post(validateLogin, LoginUser);

userRouter.route('/signup').get(function (req, res) {
  res.status(200).sendFile(_path2.default.join(__dirname, '..', '..', 'template', 'html', 'signup.html'));
}).post(validateSignup, RegisterUser);

exports.default = userRouter;
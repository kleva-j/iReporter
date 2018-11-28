'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _index = require('../models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Users = _index2.default.Users;

/**
 * @class UserController
 * @classdesc Implements user sign up, log in and profile update
 */

var UserController = function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, null, [{
    key: 'RegisterUser',

    /**
     * Signs up a user
     *
     * @static
     * @param {object} req - The request object
     * @param {object} res - The response object
     * @return {object} token or message
     * @memberof UserController
     */
    value: function RegisterUser(req, res) {
      var _req$body = req.body,
          firstname = _req$body.firstname,
          lastname = _req$body.lastname,
          othernames = _req$body.othernames,
          password = _req$body.password,
          email = _req$body.email,
          username = _req$body.username,
          phoneNumber = _req$body.phoneNumber;

      // eslint-disable-next-line consistent-return

      Users.forEach(function (user) {
        if (username === user.username) {
          return res.status(400).jsend.fail({ message: 'Username has been taken' });
        }if (email === user.email) {
          return res.status(400).jsend.fail({ message: 'Email has been used' });
        }
      });

      var hashPassword = _bcryptjs2.default.hashSync(password, 10);

      var newUser = {
        id: (0, _v2.default)(),
        firstname: firstname,
        lastname: lastname,
        othernames: othernames,
        hashPassword: hashPassword,
        email: email,
        phoneNumber: phoneNumber,
        username: username,
        registered: new Date(),
        isAdmin: false
      };

      Users.push(newUser);

      return res.status(201).jsend.success({
        message: 'User successfully registered',
        data: newUser
      });
    }

    /**
     * Logs in a user
     *
     * @static
     * @param {object} req - The request object
     * @param {object} res - The response object
     * @return {object} token or message
     * @memberof UserController
     */

  }, {
    key: 'LoginUser',
    value: function LoginUser(req, res) {
      var _req$body2 = req.body,
          username = _req$body2.username,
          password = _req$body2.password;

      // eslint-disable-next-line consistent-return

      Users.forEach(function (user) {
        if (username === user.username) {
          var checkPass = _bcryptjs2.default.compareSync(password, user.hashPassword);
          if (checkPass) {
            return res.status(200).jsend.success({
              message: 'User successfully logged in',
              user: user
            });
          }
        }
      });

      return res.status(404).jsend.fail({
        message: 'User not found'
      });
    }
  }]);

  return UserController;
}();

exports.default = UserController;
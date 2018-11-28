'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isEmail = require('validator/lib/isEmail');

/**
 * @class UserController
 * @classdesc Implements validation of user signup details
 */

var Validator = function () {
  function Validator() {
    _classCallCheck(this, Validator);
  }

  _createClass(Validator, null, [{
    key: 'validateLogin',

    /**
     * Validate Login details
     *
     * @static
     * @param {object} req - The request object
     * @param {object} res - The response object
     * @param {object} res - The next middleware
     * @return {object} token or message
     * @memberof UserController
     */
    value: function validateLogin(req, res, next) {
      var _req$body = req.body,
          username = _req$body.username,
          password = _req$body.password;

      if (!username || !password) return res.status(400).json({ message: 'Your request was incomplete' });
      return next();
    }

    /**
     * Validate Login details
     *
     * @static
     * @param {object} req - The request object
     * @param {object} res - The response object
     * @param {object} res - The next middleware
     * @return {object} token or message
     * @memberof UserController
     */

  }, {
    key: 'validateSignup',
    value: function validateSignup(req, res, next) {
      var _req$body2 = req.body,
          firstname = _req$body2.firstname,
          lastname = _req$body2.lastname,
          username = _req$body2.username,
          email = _req$body2.email,
          password = _req$body2.password,
          phoneNumber = _req$body2.phoneNumber;


      if (!firstname) {
        return res.status(400).jsend.fail({
          message: 'Firstname is empty.'
        });
      }

      if (!lastname) {
        return res.status(400).jsend.fail({
          message: 'Lastname is empty.'
        });
      }

      if (!username) {
        return res.status(400).jsend.fail({
          message: 'Username is empty.'
        });
      }

      if (!email) {
        return res.status(400).jsend.fail({
          message: 'Email address is empty.'
        });
      }

      if (!password) {
        return res.status(400).jsend.fail({
          message: 'Password is empty.'
        });
      }

      if (!phoneNumber) {
        return res.status(400).jsend.fail({
          message: 'PhoneNumber is empty.'
        });
      }

      if (typeof username !== 'string') {
        return res.status(400).jsend.fail({
          message: 'Your username was invalid.'
        });
      }

      if (!isEmail(email)) {
        return res.status(400).jsend.fail({
          message: 'Your email address was invalid.'
        });
      }

      var passwordLength = password.length;
      if (passwordLength < 8 || passwordLength > 4000) {
        return res.status(400).jsend.fail({
          message: 'The password length should be a least 8 digit in length'
        });
      }

      return next();
    }
  }]);

  return Validator;
}();

exports.default = Validator;
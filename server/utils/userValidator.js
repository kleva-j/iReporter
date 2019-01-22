/* eslint-disable no-restricted-globals */
const isEmail = require('validator/lib/isEmail');

/**
 * @class UserController
 * @classdesc Implements validation of user signup details
 */
class Validator {
  /**
   * Validate Login details
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - The next middleware
   * @return {object} token or message
   * @memberof UserController
   */
  static validateLogin(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        status: 400,
        error: 'Your request was incomplete',
      });
    }
    return next();
  }

  /**
   * Validate Login details
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - The next middleware
   * @return {object} token or message
   * @memberof UserController
   */
  static validateSignup(req, res, next) {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      phonenumber,
    } = req.body;

    if (!firstname) {
      return res.status(400).json({
        status: 400,
        error: 'Firstname is required',
      });
    }

    if (!lastname) {
      return res.status(400).json({
        status: 400,
        error: 'Lastname is required',
      });
    }

    if (!username) {
      return res.status(400).json({
        status: 400,
        error: 'Username is required',
      });
    }

    if (!email) {
      return res.status(400).json({
        status: 400,
        error: 'Email address is required',
      });
    }

    if (!password) {
      return res.status(400).json({
        status: 400,
        error: 'Password is required',
      });
    }

    if (!phonenumber) {
      return res.status(400).json({
        status: 400,
        error: 'PhoneNumber is required',
      });
    }

    const isNumber = parseInt(phonenumber, 10);
    if (isNaN(isNumber)) {
      return res.staus(400)
    }

    if (typeof username !== 'string') {
      return res.status(400).json({
        status: 400,
        error: 'Your username is invalid',
      });
    }

    if (!isEmail(email)) {
      return res.status(400).json({
        status: 400,
        error: 'Your Email address is invalid',
      });
    }

    const passwordLength = password.length;
    if (passwordLength < 8 || passwordLength > 4000) {
      return res.status(400).json({
        status: 400,
        error: 'The password length should be a least 8 digit in length',
      });
    }

    return next();
  }
}

export default Validator;

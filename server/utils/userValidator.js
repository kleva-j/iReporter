/* eslint-disable no-restricted-globals */
import validator, { isEmail } from 'validator';

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
      phonenumber,
      password,
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

    return next();
  }

  /**
   * Authenticate Input Length
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {function} next - The next Middleware
   * @return {object} Message and user data
   * @memberof Validate
   */
  static AuthSignupInputLength(req, res, next) {
    const {
      username, email, phonenumber, password,
    } = req.body;

    // Check Username Length
    if (!validator.isLength(`${username}`, { min: 3, max: 15 })) {
      return res.status(400).json({
        status: 400,
        error: 'Username can only be 3 to 15 characters in length',
      });
    }

    // Check Password Length
    if (!validator.isLength(password, { min: 8, max: 4000 })) {
      return res.status(400).json({
        status: 400,
        error: 'The password length should be a least 8 digit in length',
      });
    }

    if (!validator.isAlphanumeric(`${username}`)) {
      return res.status(400).json({
        status: 400,
        error: 'Username should contain just letters and numbers.',
      });
    }

    const uname = parseInt(username, 10);
    if (!isNaN(uname)) {
      return res.status(400).json({
        status: 400,
        error: 'Username should also contain letters.',
      });
    }

    const isNumber = parseInt(phonenumber, 10);
    if (isNaN(isNumber) && /^[0]\d{10}$/.test(phonenumber)) {
      return res.status(400).json({
        status: 400,
        error: 'Phone number is not valid',
      });
    }

    if (!isEmail(email)) {
      return res.status(400).json({
        status: 400,
        error: 'Your Email address is invalid',
      });
    }

    return next();
  }
}

export default Validator;

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
   * @param {object} res - The next middleware
   * @return {object} token or message
   * @memberof UserController
   */
  static validateLogin(req, res, next) {
    const { username, password } = req.body;
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
  static validateSignup(req, res, next) {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      phoneNumber,
    } = req.body;

    if (!firstname) {
      return res.status(400).jsend.fail({
        message: 'Firstname is empty.',
      });
    }

    if (!lastname) {
      return res.status(400).jsend.fail({
        message: 'Lastname is empty.',
      });
    }

    if (!username) {
      return res.status(400).jsend.fail({
        message: 'Username is empty.',
      });
    }

    if (!email) {
      return res.status(400).jsend.fail({
        message: 'Email address is empty.',
      });
    }

    if (!password) {
      return res.status(400).jsend.fail({
        message: 'Password is empty.',
      });
    }

    if (!phoneNumber) {
      return res.status(400).jsend.fail({
        message: 'PhoneNumber is empty.',
      });
    }

    if (typeof username !== 'string') {
      return res.status(400).jsend.fail({
        message: 'Your username was invalid.',
      });
    }

    if (!isEmail(email)) {
      return res.status(400).jsend.fail({
        message: 'Your email address was invalid.',
      });
    }

    const passwordLength = password.length;
    if (passwordLength < 8 || passwordLength > 4000) {
      return res.status(400).jsend.fail({
        message: 'The password length should be a least 8 digit in length',
      });
    }

    return next();
  }
}

export default Validator;

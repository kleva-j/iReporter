const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
const models = require('../models/index');

const { Users } = models;

/**
 * @class UserController
 * @classdesc Implements user sign up, log in and profile update
 */
class UserController {
  /**
   * Signs up a user
   *
   * @static
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @return {object} token or message
   * @memberof UserController
   */
  static RegisterUser(req, res) {
    const {
      firstname,
      lastname,
      othernames,
      password,
      email,
      username,
      phoneNumber,
    } = req.body;

    // eslint-disable-next-line consistent-return
    Users.forEach((user) => {
      if (username === user.username) {
        return res.status(400).jsend.fail({ message: 'Username has been taken' });
      } if (email === user.email) {
        return res.status(400).jsend.fail({ message: 'Email has been used' });
      }
    });

    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      id: uuidv4(),
      firstname,
      lastname,
      othernames,
      hashPassword,
      email,
      phoneNumber,
      username,
      registered: new Date(),
      isAdmin: false,
    };

    Users.push(newUser);

    return res.status(201).jsend.success({
      message: 'User successfully registered',
      data: newUser,
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
  static LoginUser(req, res) {
    const {
      username, password,
    } = req.body;

    // eslint-disable-next-line consistent-return
    Users.forEach((user) => {
      if (username === user.username) {
        const checkPass = bcrypt.compareSync(password, user.hashPassword);
        if (checkPass) {
          return res.status(200).jsend.success({
            message: 'User successfully logged in',
            user,
          });
        }
      }
    });

    return res.status(404).jsend.fail({
      message: 'User not found',
    });
  }
}

module.exports = UserController;

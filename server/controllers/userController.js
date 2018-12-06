// const bcrypt = require('bcryptjs');
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

    const emailFound = Users.find(user => user.email === email);

    if (emailFound) {
      return res.status(403).json({
        status: 403,
        error: 'User already exist',
      });
    }

    const newUser = [{
      id: uuidv4(),
      firstname,
      lastname,
      othernames,
      password,
      email,
      phoneNumber,
      username,
      registered: new Date(),
      isAdmin: false,
    }];

    Users.push(newUser);

    return res.status(201).json({
      status: 201,
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

    const singleUser = Users.find(user => user.username === username);

    if (singleUser) {
      if (singleUser.password === password) {
        return res.status(200).json({
          status: 200,
          data: [singleUser],
        });
      }
      return res.status(403).json({
        status: 403,
        error: 'Incorrect password',
      });
    }

    return res.status(404).json({
      status: 404,
      error: 'User does not exist',
    });
  }
}

module.exports = UserController;

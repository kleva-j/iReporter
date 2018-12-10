/* eslint-disable consistent-return */
const crypto = require('../utils/crypto');
const models = require('../models/index');
const db = require('../models/db');

const { Users } = models;
const { encrypt } = crypto;

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
      firstname, lastname, othernames,
      password, email, username, phonenumber,
    } = req.body;

    db.task('signup', t => t.users.GetByUsername(username)
      .then(($user) => {
        if ($user) {
          return res.status(403).json({
            status: 403,
            error: 'User already exist',
          });
        }
        return t.users.GetByEmail(email)
          .then(($email) => {
            if ($email) {
              return res.status(403).json({
                status: 403,
                error: 'Email already exist',
              });
            }
            const hash = encrypt(password);
            const newUser = {
              firstname,
              lastname,
              othernames,
              password: hash,
              email,
              phonenumber,
              username,
              isadmin: false,
            };
            return t.users.createUser(newUser)
              .then(user => res.status(200).json({
                status: 200,
                data: [user],
              }));
          });
      }));
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

  /**
   *
   * @param {object} req - the request object
   * @param {object} res - the response object
   */
  static getAllUsers(req, res) {
    db.users.GetAllUsers()
      .then(users => res.status(200).json({
        status: 200,
        data: users,
      }));
  }
}

module.exports = UserController;

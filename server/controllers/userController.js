/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const crypto = require('../utils/crypto');
const db = require('../models/db');
const sanitize = require('../utils/sanitizer');

const {
  encrypt,
  decrypt,
} = crypto;

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
    db.task('signup', t => t.users.GetByUsername(req.body.username)
      .then(($user) => {
        if ($user) {
          return res.status(403).json({
            status: 403,
            error: 'Username already exist',
          });
        }
        return t.users.GetByEmail(req.body.email)
          .then(($email) => {
            if ($email) {
              return res.status(403).json({
                status: 403,
                error: 'Email already exist',
              });
            }
            return t.users.GetByPhoneNumber(req.body.phonenumber)
              .then(($phone) => {
                if ($phone) {
                  return res.status(403).json({
                    status: 403,
                    error: 'Phone number already taken',
                  });
                }
                const hash = encrypt(req.body.password);
                req.body.password = hash;
                req.body.isadmin = false;
                const { body } = req;
                return t.users.createUser(body)
                  .then((user) => {
                    const $usr = sanitize(user);
                    const token = jwt.sign({
                      userId: $usr.id,
                      firstname: $usr.firstname,
                      lastname: $usr.lastname,
                      username: $usr.username,
                      email: $usr.email,
                      phonenumber: $usr.phonenumber,
                    }, process.env.SECRET_KEY, { expiresIn: '1 day' });
                    return res.status(201).json({
                      status: 201,
                      data: [{ $usr, token }],
                    });
                  });
              });
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
      username,
      password,
    } = req.body;

    db.task('login', t => t.users.GetByUsername(username)
      .then(($user) => {
        if ($user) {
          const isValidPassword = decrypt(password, $user.password);
          if (isValidPassword) {
            const token = jwt.sign({
              userId: $user.id,
              username: $user.username,
              email: $user.email,
            }, process.env.SECRET_KEY, {
              expiresIn: '1 day',
            });
            return res.status(200).json({
              status: 200,
              data: [{
                id: $user.id,
                firstname: $user.firstname,
                lastname: $user.lastname,
                othernames: $user.othernames,
                phonenumber: $user.phonenumber,
                username: $user.username,
                email: $user.email,
                token,
              }],
            });
          }
          return res.status(401).json({
            status: 401,
            error: 'Incorrect password',
          });
        }
        return res.status(404).json({
          status: 403,
          error: 'User does not exist',
        });
      }));
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

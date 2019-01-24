/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import db from '../models/db';
import { sanitizer } from '../utils/sanitizer';
import crypto from '../utils/crypto';

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
    db.task('signup', t => t.users.getByUsername(req.body.username)
      .then(($user) => {
        if ($user) {
          return res.status(403).json({
            status: 403,
            error: 'Username already exist',
          });
        }
        return t.users.getByEmail(req.body.email)
          .then(($email) => {
            if ($email) {
              return res.status(403).json({
                status: 403,
                error: 'Email already exist',
              });
            }
            return t.users.getByPhoneNumber(req.body.phonenumber)
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
                  .then(($usr) => {
                    const user = sanitizer($usr.rows[0]);
                    const token = jwt.sign({
                      userId: user.id,
                      firstname: user.firstname,
                      lastname: user.lastname,
                      username: user.username,
                      email: user.email,
                      phonenumber: user.phonenumber,
                      isadmin: user.isadmin,
                    }, process.env.SECRET_KEY, { expiresIn: '1 day' });
                    return res.status(201).json({
                      status: 201,
                      data: [{ user, token }],
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
   * @return {object} An authenticated user with a token
   * @memberof UserController
   */
  static LoginUser(req, res) {
    const {
      username, password,
    } = req.body;

    db.task('login', t => t.users.getByUsername(username)
      .then(($user) => {
        if ($user) {
          const isValidPassword = decrypt(password, $user.password);
          if (isValidPassword) {
            const token = jwt.sign({
              userId: $user.id,
              username: $user.username,
              email: $user.email,
              isadmin: $user.isadmin,
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
                isadmin: $user.isadmin,
                token,
              }],
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
      }));
  }

  /**
   * Get all users
   *
   * @static
   * @param {object} req - the request object
   * @param {object} res - the response object
   * @return {Object} An array of all the users
   * @memberof UserController
   */
  static getAllUsers(req, res) {
    db.users.getAllUsers()
      .then(users => res.status(200).json({
        status: 200,
        data: users,
      }));
  }
}

export default UserController;

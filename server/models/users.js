const db = Symbol('db');
const ctx = Symbol('ctx');

/**
 * @class Users
 * @classdesc creates a user object
 */
class Users {
  /**
   * @constructor Database object
   * @param database - the database object
   * @param dbContext - the database context
   */
  constructor(database, dbContext) {
    this[db] = database;
    this[ctx] = dbContext;
  }

  /**
   * @param  {object} values - the user details
   */
  createUser(values) {
    const sql = 'INSERT INTO users (firstname, lastname, username, email, password, phonenumber, isadmin) VALUES($(firstname), $(lastname), $(username), $(email), $(password), $(phonenumber), $(isadmin)) RETURNING (firstname, lastname, username, email, phonenumber)';
    return this[db].one(sql, values);
  }

  /**
   * @param {string} username - username
   * @memberof Users
   */
  GetByUsername(username) {
    return this[db].oneOrNone('SELECT * FROM users WHERE username = $1', username);
  }

  /**
   * @param {string} email - user email
   * @memberof Users
   */
  GetByEmail(email) {
    return this[db].oneOrNone('SELECT * FROM users WHERE email = $1', email);
  }

  /**
   * @param {string} id - user id
   * @method GetByID - returns result of query to get a user by id
   * @memberof Users
   */
  GetByID(id) {
    return this[db].one('SELECT * FROM users WHERE id = $1', id);
  }

  /**
   * @method GetAllUsers - returns all users
   * @memberof Users
   */
  GetAllUsers() {
    return this[db].any('SELECT * FROM users');
  }
}

module.exports = Users;

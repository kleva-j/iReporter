const db = Symbol('db');
const ctx = Symbol('ctx');

/**
 * @class Users
 * @classdesc A user object
 */
class Users {
  /**
   * @constructor Creates a user object
   * @param {object} database - the database object
   * @param {object} dbContext - the database context
   */
  constructor(database, dbContext) {
    this[db] = database;
    this[ctx] = dbContext;
  }

  /**
   * @param  {object} values - the user details
   * @return {object} The result of the query
   * @memberof Users
   */
  createUser(values) {
    const sql = 'INSERT INTO users (firstname, lastname, username, email, password, phonenumber, isadmin) VALUES($(firstname), $(lastname), $(username), $(email), $(password), $(phonenumber), $(isadmin)) RETURNING (id, firstname, lastname, username, email, phonenumber, isadmin)';
    return this[db].result(sql, values);
  }

  /**
   * @param {string} username - username
   * @return {object} The result of a database query
   * @memberof Users
   */
  getByUsername(username) {
    return this[db].oneOrNone('SELECT * FROM users WHERE username = $1', username);
  }

  /**
   * @param {string} email - The user email
   * @return {*} The result of the database query
   * @memberof Users
   */
  getByEmail(email) {
    return this[db].oneOrNone('SELECT * FROM users WHERE email = $1', email);
  }

  /**
   * @param {string} id - The user id
   * @return {*} The result of the database query
   * @memberof Users
   */
  getById(id) {
    return this[db].oneOrNone('SELECT * FROM users WHERE id = $1', id);
  }

  /**
   * @param {*} number - The user phonenumber
   * @returns {*} The results of the database query
   * @memberof Users
   */
  getByPhoneNumber(number) {
    return this[db].oneOrNone('SELECT * FROM users WHERE phonenumber = $1', number);
  }

  /**
   * @return {Array} An array of all users
   * @memberof Users
   */
  getAllUsers() {
    return this[db].any('SELECT * FROM users');
  }
}

export default Users;

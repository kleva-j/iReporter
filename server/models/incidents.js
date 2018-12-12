const db = Symbol('db');
const ctx = Symbol('ctx');

/**
 * @class Incident
 * @classdesc Creates an incident object
 */
class Incident {
  /**
   *
   * @param {*} database - the database object
   * @param {*} dbContext - the database context
   * @return {object} an incident instance
   */
  constructor(database, dbContext) {
    this[db] = database;
    this[ctx] = dbContext;
  }

  /**
   *
   * @param {object} values - The incident details
   * @return {Array} The result of the query
   * @memberof Incidents
   */
  createIncident(values) {
    const sql = 'INSERT INTO incidents(createdby, type, location, images, videos, comment) VALUES($(createdby), $(type), $(location), $(images), $(videos)) RETURNING *';
    return this[db].one(sql, values);
  }

  /**
   * @param {number} id - The incident's id
   * @returns {Array} The result of the query
   * @memberof Incidents
   */
  getById(id) {
    return this[db].oneOrNone('SELECT * FROM incidents WHERE id = $1', id);
  }

  /**
   * @param {string} comment - The comment of the incident
   * @returns {Array} The result of the query
   * @memberof Incidents
   */
  getByComment(comment) {
    return this[db].any('SELECT * FROM incidents WHERE comment = $1', comment);
  }

  /**
   * @param {string} location - The location of the incident
   * @returns {Array} The result of the query
   * @memberof Incidents
   */
  getByLocation(location) {
    return this[db].any('SELECT * FROM incidents WHERE location = $1', location);
  }

  /**
   * @param {string} status - The status of the incident
   * @returns {Array} The result of the query
   * @memberof Incidents
   */
  getByStatus(status) {
    return this[db].any('SELECT * FROM incidents WHERE status = $1', status);
  }

  /**
   * @param {string} id - The creator id
   * @returns {Array} The result of the query
   * @memberof Incidents
   */
  getByCreatorId(id) {
    return this[db].oneOrNone('SELECT * FROM incidents WHERE createdby = $1', id);
  }

  /**
   * @param {string} date - The creation date of the incident
   * @returns {Array} The result of the query
   * @memberof Incidents
   */
  getByDate(date) {
    return this[db].oneOrNone('SELECT * FROM incidents WHERE createdon = $1', date);
  }

  /**
   * @param {string} username - The creator username
   * @returns {Array} The result of the query
   * @memberof Incidents
   */
  getByCreatorUsername(username) {
    return this[db].oneOrNone('SELECT id FROM users WHERE email = $1 ', username)
      .then(userId => this[db].any('SELECT * FROM incidents WHERE id = $1', userId));
  }

  /**
   * @param {string} userEmail - The creator email
   * @returns {Array} The result of the query
   * @memberof Incidents
   */
  getByCreatorEmail(userEmail) {
    return this[db].oneOrNone('SELECT id FROM users WHERE email = $1 ', userEmail)
      .then(userId => this[db].any('SELECT * FROM incidents WHERE id = $1', userId));
  }
}

export default Incident;

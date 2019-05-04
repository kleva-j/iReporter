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
    const sql = 'INSERT INTO incidents(createdby, type, location, images, videos, comment) VALUES($(createdby), $(type), $(location), $(images), $(videos), $(comment)) RETURNING *';
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

  /**
   * @method
   * @param {string} status - the updated status
   * @param {number} id - the id of the record
   * @returns {object} a json object
   */
  updateARecordStatus(status, id) {
    return this[db].result('UPDATE incidents SET status=$1 WHERE id=$2', [status, id]);
  }

  /**
   * @method updateARecordComment
   * @param {*} comment - the updated comment
   * @param {*} id - the id of the record
   * @returns {object} a json object
   */
  updateARecordComment(comment, id) {
    return this[db].result('UPDATE incidents SET comment=$1 WHERE id=$2', [comment, id]);
  }

  /**
   * @method updateARecordLocation
   * @param {*} location - the updated location
   * @param {*} id - the id of the record
   * @returns {object} a json object
   */
  updateARecordLocation(location, id) {
    return this[db].result('UPDATE incidents SET location=$1 WHERE id=$2', [location, id]);
  }

  /**
   * @method getAllRedflags
   * @returns {Array} The result of all red-flag records
   * @memberof Incidents
   */
  getAllRedflags() {
    return this[db].any('SELECT * FROM incidents WHERE type = $1', 'red-flag');
  }

  /**
   * @method getAllRedflags
   * @param {string} id the id of the red-flag
   * @returns {Array} The result of all red-flag records
   * @memberof Incidents
   */
  getUserRedflags(id) {
    return this[db].any(`SELECT * FROM incidents WHERE type='red-flag' AND createdby='${id}'`);
  }

  /**
   * @method getAllInterventions
   * @param {string} id the id of the record
   * @returns {Array} The result of all intervention records
   * @memberof Incidents
   */
  getUserInterventions(id) {
    return this[db].any(`SELECT * FROM incidents WHERE type='intervention' AND createdby='${id}'`);
  }

  /**
   * @method getAllInterventions
   * @returns {Array} The result of all intervention records
   * @memberof Incidents
   */
  getAllInterventions() {
    return this[db].any('SELECT * FROM incidents WHERE type = $1', 'intervention');
  }

  /**
   * @method deleteRecord
   * @param {number} id - the id of the record
   * @returns {Array} The result of all incident record
   * @memberof Incidents
   */
  deleteRecord(id) {
    return this[db].result('DELETE FROM incidents WHERE id = $1', id);
  }

  /**
   * @method getUsersStatuses
   * @param {String} type the type of record
   * @param {Number} userId the user id
   * @returns {Object} an array of users record statuses
   * @memberof Incidents
   */
  getUserStatuses(type, userId) {
    return this[db].result('SELECT status FROM incidents WHERE type = $1 AND createdby = $2', [type, userId]);
  }

  /**
   * @method getAllStatuses
   * @param {String} type the type of record
   * @returns {Object} an array of all record statuses
   * @memberof Incidents
   */
  getAllStatuses(type) {
    return this[db].result('SELECT status FROM incidents WHERE type = $1', type);
  }

  /**
   * @method updateImage
   * @param {*} filename the filename to be uploaded
   * @param {*} id the id of the record
   * @returns {object} the result of the update
   */
  updateImage(filename, id) {
    return this[db].result('UPDATE incident SET images = array_append(images, $1) WHERE id = $2', [filename, id]);
  }

  /**
   * @param {*} userId - The user phonenumber
   * @param {*} status - The user phonenumber
   * @param {*} type - The user phonenumber
   * @returns {*} The results of the database query
   * @memberof Users
   */
  getRecordCount(userId, status, type) {
    return this[db].any('SELECT COUNT(*) FROM incidents WHERE userId = $1 AND status = $2 AND type = #3', [status, userId, type]);
  }
}

export default Incident;

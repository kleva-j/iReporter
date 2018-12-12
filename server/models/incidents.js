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

  /**
   * @param {string} status - the updated status
   * @param {number} id - the id of the record
   */
  updateARecordStatus(status, id) {
    return this[db].one('UPDATE incidents SET status=$1 WHERE id=$2', [status, id]);
  }

  /**
   * @param {*} comment - the updated comment
   * @param {*} id - the id of the record
   */
  updateARecordComment(comment, id) {
    return this[db].one('UPDATE incidents SET comment=$1 WHERE id=$2', [comment, id]);
  }

  /**
   * @param {*} location - the updated location
   * @param {*} id - the id of the record
   */
  updateARecordLocation(location, id) {
    return this[db].one('UPDATE incidents SET location=$1 WHERE id=$2', [location, id]);
  }

  /**
   * @method getAllRedflags
   * @returns {Array} The result of all red-flag records
   * @memberof Incidents
   */
  getAllRedflags() {
    return this[db].any('SELECT * FROM incidents WHERE type = $1', 'Red-flag');
  }

  /**
   * @method getAllInterventions
   * @returns {Array} The result of all intervention records
   * @memberof Incidents
   */
  getAllInterventions() {
    return this[db].any('SELECT * FROM incidents WHERE type = $1', 'Interventions');
  }

  /**
   * @method getAllRecords
   * @returns {Array} The result of all incident record
   * @memberof Incidents
   */
  getAllRecords() {
    return this[db].any('SELECT * FROM incidents');
  }

  /**
   *
   * @param {number} id - the id of the record
   */
  deleteRecord(id) {
    return this[db].result('DELETE * FROM incident WHERE id = $1', id);
  }

  /**
   *
   * @param {number} id - the id of the redflag
   */
  deleteRedflagById(id) {
    return this[db].result('DELETE FROM incidents WHERE id = $1', id);
  }

  updateARecordStatus(status, id) {
    return this[db].one('UPDATE incidents SET status=$1 WHERE id=$2', [status, id]);
  }

  updateARecordComment(comment, id) {
    return this[db].one('UPDATE incidents SET comment=$1 WHERE id=$2', [comment, id]);
  }

  updateARecordLocation(location, id) {
    return this[db].one('UPDATE incidents SET location=$1 WHERE id=$2', [location, id]);
  }
}

export default Incident;

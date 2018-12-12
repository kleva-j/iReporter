const db = Symbol('db');
const ctx = Symbol('ctx');

/**
 * @class Incident
 * @classdesc Creates an incident object
 */
class Incident {
  constructor(database, dbContext) {
    this[db] = database;
    this[ctx] = dbContext;
  }

  createIncident(values) {
    const sql = 'INSERT INTO incidents(createdby, type, location, images, videos, comment) VALUES($(createdby), $(type), $(location), $(images), $(videos)) RETURNING *';
    return this[db].one(sql, values);
  }

  getById(id) {
    return this[db].oneOrNone('SELECT * FROM incidents WHERE id = $1', id);
  }

  getByComment(comment) {
    return this[db].any('SELECT * FROM incidents WHERE comment = $1', comment);
  }

  getByLocation(location) {
    return this[db].any('SELECT * FROM incidents WHERE location = $1', location);
  }

  getByStatus(status) {
    return this[db].any('SELECT * FROM incidents WHERE status = $1', status);
  }

  getByCreatorId(id) {
    return this[db].oneOrNone('SELECT * FROM incidents WHERE createdby = $1', id);
  }

  getByDate(date) {
    return this[db].oneOrNone('SELECT * FROM incidents WHERE createdon = $1', date);
  }

  getByCreatorUsername(username) {
    return this[db].oneOrNone('SELECT id FROM users WHERE email = $1 ', username)
      .then(userId => this[db].any('SELECT * FROM incidents WHERE id = $1', userId));
  }

  getByCreatorEmail(userEmail) {
    return this[db].oneOrNone('SELECT id FROM users WHERE email = $1 ', userEmail)
      .then(userId => this[db].any('SELECT * FROM incidents WHERE id = $1', userId));
  }
}

export default Incident;

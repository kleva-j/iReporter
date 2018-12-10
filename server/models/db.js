const pgp = require('pg-promise');
const bluebird = require('bluebird');
const dotenv = require('dotenv');
const Users = require('./users');

dotenv.config();

let connectionString = '';

if (process.env.NODE_ENV === 'development') {
  connectionString = process.env.DB_DEV;
} else if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.DB_TEST;
} else { connectionString = process.env.DB_DEV; }

const initConfig = {
  promiseLib: bluebird,
  extend(obj) {
    const rep = obj;
    rep.users = new Users(obj, pgp);
    return rep;
  },
};

const $db = pgp(initConfig);

const db = $db(connectionString);

module.exports = db;

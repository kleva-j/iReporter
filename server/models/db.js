const pgp = require('pg-promise');
const { QueryFile } = require('pg-promise');
const bluebird = require('bluebird');
const dotenv = require('dotenv');

dotenv.config();

const { log } = console;

const initConfig = {
  promiseLib: bluebird,
};

let connectionString = '';

if (process.env.NODE_ENV === 'development') {
  connectionString = process.env.DB_DEV;
} else if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.DB_TEST;
} else { connectionString = process.env.DB_DEV; }

const db = pgp(initConfig)(connectionString);

const qs = file => new QueryFile(file, { minify: true });

db
  .query(qs('tables.sql'))
  .then(() => log('Database created successfully'))
  .catch(err => log(err));

module.exports = db;

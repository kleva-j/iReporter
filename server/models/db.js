import pgp from 'pg-promise';
import bluebird from 'bluebird';
import dotenv from 'dotenv';
import Users from './users';
import Incidents from './incidents';

dotenv.config();

let connectionString = '';

if (process.env.NODE_ENV === 'development') {
  connectionString = process.env.DATABASE_URL;
} else if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.DB_TEST;
} else { connectionString = process.env.DATABASE_URL; }

const initConfig = {
  promiseLib: bluebird,
  extend(obj) {
    const rep = obj;
    rep.users = new Users(obj, pgp);
    rep.incidents = new Incidents(obj, pgp);
    return rep;
  },
};

const $db = pgp(initConfig);

const db = $db(connectionString);

export default db;

import path from 'path';
import { QueryFile } from 'pg-promise';
import db from './db';

const { log } = console;

/**
 * @param {string} file - the file name of the sql file
 * @returns {object} an instance of a Queryfile
 */
const qs = file => new QueryFile(path.join(__dirname, file), { minify: true });

db
  .query(qs('tables.sql'))
  .then(() => log('Database created successfully'))
  .catch(err => log(err));

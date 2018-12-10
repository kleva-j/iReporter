const path = require('path');
const { QueryFile } = require('pg-promise');
const db = require('./db');

const { log } = console;

const qs = file => new QueryFile(path.join(__dirname, file), { minify: true });

db
  .query(qs('tables.sql'))
  .then(() => log('Database created successfully'))
  .catch(err => log(err));

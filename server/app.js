const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const jsend = require('jsend');
const cors = require('cors');
const helmet = require('helmet');
const routers = require('./routes/index');

const { log } = console;
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', '/template')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(jsend.middleware);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

app.get('/', (req, res) => {
  res.send('Welcome to Ireporter Api');
});

routers(app);

const port = process.env.PORT || 2080;

app.listen(port, () => {
  log(`App listening on port ${port}`);
});

process.on('uncaughtException', err => log('uncaught exception', err));
process.on('unhandledRejection', err => log('unhandled rejection', err));

module.exports = app;

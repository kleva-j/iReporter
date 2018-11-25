const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const jsend = require('jsend');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(logger('combined'));

app.use(express.static(path.join(__dirname, '/template')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(jsend.middleware);
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
  res.send('Welcome to Ireporter Api');
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

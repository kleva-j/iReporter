'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsend = require('jsend');

var _jsend2 = _interopRequireDefault(_jsend);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use((0, _helmet2.default)());
app.use((0, _cors2.default)());
app.use(_express2.default.static(_path2.default.join(__dirname, '..', '/template')));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_jsend2.default.middleware);
app.use((0, _morgan2.default)('combined'));

app.get('/', function (req, res) {
  res.send('Welcome to Ireporter Api');
});

(0, _index2.default)(app);

var port = process.env.PORT || 2080;

app.listen(port, function () {
  console.log('App listening on port ' + port);
});
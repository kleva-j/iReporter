'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _userRoute = require('./userRoute');

var _userRoute2 = _interopRequireDefault(_userRoute);

var _incidentRoute = require('./incidentRoute');

var _incidentRoute2 = _interopRequireDefault(_incidentRoute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
  app.use('/api/v1/users/auth', _userRoute2.default);
  app.use('/api/v1', _incidentRoute2.default);
};
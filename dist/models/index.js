'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _incidents = require('./incidents');

var _incidents2 = _interopRequireDefault(_incidents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Users: _users2.default,
  Incidents: _incidents2.default
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var users = [{
  id: (0, _v2.default)(),
  firstname: 'kelly',
  lastname: 'white',
  othernames: 'bob',
  email: 'kelly_white@gmail.com',
  hashPassword: 'kelly',
  phoneNumber: '08001112222',
  username: 'kelly-W',
  registered: new Date(),
  isAdmin: true
}, {
  id: (0, _v2.default)(),
  firstname: 'kasmic',
  lastname: 'kleva',
  othernames: 'kleva-j',
  email: 'kasmic_kleva@gmail.com',
  hashPassword: 'kkkkk',
  phoneNumber: '09012233344',
  username: 'kasmickleva',
  registered: new Date(),
  isAdmin: false
}, {
  id: (0, _v2.default)(),
  firstname: 'clinton',
  lastname: 'nkwodia',
  othernames: 'sule',
  email: 'clinton_sule@gmail.com',
  hashPassword: 'ccccc',
  phoneNumber: '08048890112',
  username: 'akproko',
  registered: new Date(),
  isAdmin: false
}];

exports.default = users;
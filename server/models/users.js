const uuidv4 = require('uuid/v4');

const users = [
  {
    id: 1,
    firstname: 'kelly',
    lastname: 'white',
    othernames: 'bob',
    email: 'kelly_white@gmail.com',
    hashPassword: 'kelly',
    phoneNumber: '08001112222',
    username: 'kelly-W',
    registered: new Date(),
    isAdmin: true,
  },
  {
    id: 2,
    firstname: 'belly',
    lastname: 'rhite',
    othernames: 'bob',
    email: 'belly_rhite@gmail.com',
    hashPassword: 'belly',
    phoneNumber: '08001112222',
    username: 'Belly-R',
    registered: new Date(),
    isAdmin: false,
  },
  {
    id: 3,
    firstname: 'kasmic',
    lastname: 'kleva',
    othernames: 'kleva-j',
    email: 'kasmic_kleva@gmail.com',
    hashPassword: 'kkkkk',
    phoneNumber: '09012233344',
    username: 'kasmickleva',
    registered: new Date(),
    isAdmin: false,
  },
  {
    id: uuidv4(),
    firstname: 'clinton',
    lastname: 'nkwodia',
    othernames: 'sule',
    email: 'clinton_sule@gmail.com',
    hashPassword: 'ccccc',
    phoneNumber: '08048890112',
    username: 'akproko',
    registered: new Date(),
    isAdmin: false,
  },
];

module.exports = users;

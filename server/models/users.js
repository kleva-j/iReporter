import uuidv4 from 'uuid/v4';

const users = [
  {
    id: uuidv4(),
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
    id: uuidv4(),
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

export default users;

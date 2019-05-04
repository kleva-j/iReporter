import chai from 'chai';
import { expect } from 'chai';
import chaiHTTP from 'chai-http';
import db from '../models/db';
import app from '../app';
import dotenv from 'dotenv';
import crypto from '../utils/crypto';

const { encrypt } = crypto;

dotenv.config();

chai.use(chaiHTTP);

const url = '/api/v1/user/';

describe('USERS', () => {

  before(async () => {
    try {
      await db.query('DELETE FROM users');
      console.log('Users deleted successfully');
    } catch(error) {
      console.log(error);
    }
  });

  describe('SIGN UP A NEW USER', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        firstname: 'Michael',
        lastname: 'Obasi',
        username: 'kleva1',
        email: 'kasmickleva@gmail.com',
        password: 'bbdd-@@@@',
        phonenumber: '08062308772',
        isadmin: false,
      }
    });
    
    it('It should register a new user', (done) => {
      chai.request(app)
        .post(`${url}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(201);
          expect(res.body).to.have.keys(['status', 'data']);
          expect(res.body.data[0].user).to.have.property('id');
          expect(res.body.data[0].user).to.have.property('firstname');
          expect(res.body.data[0].user).to.have.property('lastname');
          expect(res.body.data[0].user).to.have.property('username');
          expect(res.body.data[0].user).to.have.property('email');
          expect(res.body.data[0].user).to.have.property('phonenumber');
          expect(res.body.data).to.be.instanceOf(Array);
          done();
        });
    });

    // no firstname
    it('It should fail to signup if firstname is not sent', (done) => {
      newUser.firstname = undefined;
      chai.request(app)
        .post(`${url}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(422);
          expect(res.body).to.have.keys(['status', 'errors']);
          done();
        });
    });

    // no lastname
    it('It should fail to signup if lastname is not sent', (done) => {
      newUser.lastname = undefined;
      chai.request(app)
        .post(`${url}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(422);
          expect(res.body).to.have.keys(['status', 'errors']);
          done();
        });
    });

    // no username
    it('It should fail to signup if username is not sent', (done) => {
      newUser.username = undefined;
      chai.request(app)
        .post(`${url}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(422);
          expect(res.body).to.have.keys(['status', 'errors']);
          done();
        });
    });

    // no email
    it('It should fail to signup if email is not sent', (done) => {
      newUser.email = undefined;
      chai.request(app)
        .post(`${url}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(422);
          expect(res.body).to.have.keys(['status', 'errors']);
          done();
        });
    });

    // no password
    it('It should fail to signup if password is not sent', (done) => {
      newUser.password = undefined;
      chai.request(app)
        .post(`${url}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(422);
          expect(res.body).to.have.keys(['status', 'errors']);
          done();
        });
    });

    // no phoneNumber
    it('It should fail to signup if phoneNumber is not sent', (done) => {
      newUser.phonenumber = undefined;
      chai.request(app)
        .post(`${url}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(422);
          expect(res.body).to.have.keys(['status', 'errors']);
          done();
        });
    });

    // Invalid Email address
    it('It should fail to signup if email address is invalid', (done) => {
      newUser.email = '#bootcamp';
      chai.request(app)
        .post(`${url}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(422);
          expect(res.body).to.have.keys(['status', 'errors']);
          done();
        });
    });

    // Incorrect Password length
    it('It should fail to signup if length of password is less than 8', (done) => {
      newUser.password = 'anda';
      chai.request(app)
        .post(`${url}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(422);
          expect(res.body).to.have.keys(['status', 'errors']);
          done();
        });
    });

    // Invalid Username
    it('It should fail to signup if username is not valid', (done) => {
      newUser.username = 2233;
      chai.request(app)
        .post(`${url}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(422);
          expect(res.body).to.have.keys(['status', 'errors']);
          done();
        });
    });

  });

  describe('LOG IN A USER', () => {

    before(async () => {
      try {
        await db.query('DELETE FROM users')
        console.log('Users deleted successfully again')
        
        const password = encrypt('password');
        await db.users.createUser({
          firstname: 'firstname',
          lastname: 'lastname',
          username: 'username',
          email: 'email@email.com',
          password,
          phonenumber: '08064477211',
          isadmin: false
        })
      } catch(errors) {
        console.log(errors);
      }
    });

    let registeredUser;

    beforeEach(() => {
      registeredUser = {
        username: 'username',
        password: 'password',
      }
    });

    it('It should login a user', (done) => {
      chai.request(app)
        .post(`${url}/login`)
        .send(registeredUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(200);
          expect(res.body).to.have.keys(['status', 'data']);
          expect(res.body.data[0]).to.have.property('id');
          expect(res.body.data[0]).to.have.property('firstname');
          expect(res.body.data[0]).to.have.property('lastname');
          expect(res.body.data[0]).to.have.property('othernames');
          expect(res.body.data[0]).to.have.property('username');
          expect(res.body.data[0]).to.have.property('email');
          expect(res.body.data[0]).to.have.property('phonenumber');
          expect(res.body.data).to.be.instanceOf(Array);
          done();
        });
    });

    it('It should fail to login if user is not found', (done) => {
      registeredUser.username = 'aaaaaaaaaaaa';
      chai.request(app)
        .post(`${url}/login`)
        .send(registeredUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(404);
          expect(res.body).to.have.keys(['status', 'errors']);
          done();
        });
    });

    it('It should fail to login if there is no username sent', (done) => {
      registeredUser.username = undefined;
      chai.request(app)
        .post(`${url}/login`)
        .send(registeredUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(422);
          expect(res.body).to.have.keys(['status', 'errors']);
          done();
        });
    });

    it('It should fail to login if password is incorrect', (done) => {
      registeredUser.password = 'asadssasd'
      chai.request(app)
        .post(`${url}/login`)
        .send(registeredUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(403);
          expect(res.body).to.have.keys(['status', 'errors']);
          done();
        });
    });

    it('It should fail to login if there is no username sent', (done) => {
      registeredUser.password = undefined;
      chai.request(app)
        .post(`${url}/login`)
        .send(registeredUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(422);
          expect(res.body).to.have.keys(['status', 'errors']);
          done();
        });
    });

  });
  
});
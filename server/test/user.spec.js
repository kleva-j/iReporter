import chai from 'chai';
import { expect } from 'chai';
import chaiHTTP from 'chai-http';
import db from '../models/db';
import app from '../app';

chai.use(chaiHTTP);

const url = '/api/v1/users/auth';

describe('USERS', () => {

  before((done) => {
    db.query('DELETE FROM users')
      .then(() => {
        console.log("All users have been deleted");
        done();
    });
  });

  describe('SIGN UP A NEW USER', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        firstname: 'Michael',
        lastname: 'Obasi',
        username: 'kleva-j',
        othernames: 'albert',
        email: 'kasmickleva@gmail.com',
        password: 'bbdd-@@@@',
        phonenumber: '08062308772',
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
          expect(res.body.data[0].$usr).to.have.property('id');
          expect(res.body.data[0].$usr).to.have.property('firstname');
          expect(res.body.data[0].$usr).to.have.property('lastname');
          expect(res.body.data[0].$usr).to.have.property('username');
          expect(res.body.data[0].$usr).to.have.property('email');
          expect(res.body.data[0].$usr).to.have.property('phonenumber');
          expect(res.body.data).to.be.instanceOf(Array);
          done();
        });
    });

    // no firstname
    it('It should fail to signup if username is not sent', (done) => {
      newUser.firstname = undefined;
      chai.request(app)
        .post(`${url}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(400);
          expect(res.body).to.have.keys(['status', 'error']);
          expect(res.body).to.have.property('error').to.eq('Firstname is required');
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
          expect(res.status).to.eq(400);
          expect(res.body).to.have.keys(['status', 'error']);
          expect(res.body).to.have.property('error').to.eq('Lastname is required');
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
          expect(res.status).to.eq(400);
          expect(res.body).to.have.keys(['status', 'error']);
          expect(res.body).to.have.property('error').to.eq('Username is required');
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
          expect(res.status).to.eq(400);
          expect(res.body).to.have.keys(['status', 'error']);
          expect(res.body).to.have.property('error').to.eq('Email address is required');
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
          expect(res.status).to.eq(400);
          expect(res.body).to.have.keys(['status', 'error']);
          expect(res.body).to.have.property('error').to.eq('Password is required');
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
          expect(res.status).to.eq(400);
          expect(res.body).to.have.keys(['status', 'error']);
          expect(res.body).to.have.property('error').to.eq('PhoneNumber is required');
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
          expect(res.status).to.eq(400);
          expect(res.body).to.have.keys(['status', 'error']);
          expect(res.body).to.have.property('error').to.eq('Your Email address is invalid');
          done();
        });
    });

    // Incorrect Password length
    it('It should fail to signup if length of password is less than 8', (done) => {
      newUser.password = 'andela';
      chai.request(app)
        .post(`${url}/signup`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(400);
          expect(res.body).to.have.keys(['status', 'error']);
          expect(res.body).to.have.property('error').to.eq('The password length should be a least 8 digit in length');
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
          expect(res.status).to.eq(400);
          expect(res.body).to.have.keys(['status', 'error']);
          expect(res.body).to.have.property('error').to.eq('Your username is invalid');
          done();
        });
    });

  });

  describe('LOG IN A USER', () => {

    before((done) => {
      chai.request(app)
        .post(`${url}/signup`)
        .send({
          firstname: 'firstname',
          lastname: 'lastname',
          username: 'username',
          email: 'email@gmail.com',
          password: 'password',
          phonenumber:'phonenumber',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(201);
          done();
        });
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
          expect(res.body).to.have.keys(['status', 'error']);
          expect(res.body).to.have.property('error').to.eq('User does not exist');
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
          expect(res.status).to.eq(400);
          expect(res.body).to.have.keys(['status', 'error']);
          expect(res.body).to.have.property('error').to.eq('Your request was incomplete');
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
          expect(res.status).to.eq(401);
          expect(res.body).to.have.keys(['status', 'error']);
          expect(res.body).to.have.property('error').to.eq('Incorrect password');
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
          expect(res.status).to.eq(400);
          expect(res.body).to.have.keys(['status', 'error']);
          expect(res.body).to.have.property('error').to.eq('Your request was incomplete');
          done();
        });
    });

  });
  
});
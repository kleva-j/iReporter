import { use, request } from 'chai';
import { expect } from 'chai';
import chaiHTTP from 'chai-http';
import dotenv  from 'dotenv';
import db from '../models/db';
import app from '../../server/app';
import { encrypt } from '../utils/crypto';
import jwt from 'jsonwebtoken';

dotenv.config();

use(chaiHTTP);

const url = '/api/v1/red-flags';

describe('/POST - create a red-flag record', () => {

  let userToken;
  before(async () => {
    try {
      await db.query('DELETE FROM users');
      await db.query('DELETE FROM incidents');
      console.log('Users and Incidents deleted successfully')
      const password = encrypt('password');
      await db.users.createUser({
        firstname: 'firstname',
        lastname: 'lastname',
        username: 'username',
        email: 'email@email.com',
        password,
        phonenumber: '08064477211',
        isadmin: false,
      });
      const userDetails = await db.users.getByUsername('username');
      userToken = jwt.sign({
        userId: userDetails.id,
        username: userDetails.username,
        email: userDetails.email,
        isadmin: userDetails.isadmin,
      }, process.env.SECRET_KEY, { expiresIn: '1 day' });

    } catch(error) {
      return error;
    }
  });

  let requestObject;
  beforeEach(() => {
    requestObject = {
      createdOn: new Date().toString(),
      createdBy: 1,
      type: 'red-flag',
      location: '6.111111, 3.222222',
      evidence: '',
      comment: 'this is the news report',
    };
  });

  // create a red-flag record
  it('should create a red-flag', (done) => {
    request(app)
      .post(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', userToken)
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.eq(201);
        expect(res.body).to.have.keys(['status', 'data']);
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('message');
        expect(res.body.data[0]).to.have.property('message').to.eq('Created new red-flag record');
        expect(res.body.data).to.be.instanceOf(Array);
        done();
      });
  });

   // test validity of creatorId
  it('should reject if user is not logged in', (done) => {
    request(app)
      .post(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys(['status', 'message']);
        expect(res.body).to.have.property('message').eql('You are required to signup or login to continue');
        done();
      });
  });
  
  //validate type
  it('should reject if type is not defined', (done) => {
    requestObject.type = undefined;
    request(app)
      .post(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', userToken)
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('errors');
        expect(res.body).to.have.keys(['status', 'errors']);
        done();
      });
  });

  it('should reject if type is not a red-flag or an intervention', (done) => {
    requestObject.type = 'asdf';
    request(app)
      .post(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', userToken)
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('errors');
        expect(res.body).to.have.keys(['status', 'errors']);
        done();
      });
  });

  //validate comment 
  it('should report if comment is not sent', (done) => {
    requestObject.comment = undefined;
    request(app)
      .post(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', userToken)
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('errors');
        expect(res.body).to.have.keys(['status', 'errors']);
        done();
      });
  });

  it('should return if comment is not a valid string datatype', (done) => {
    requestObject.comment = 1000;
    request(app)
      .post(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', userToken)
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('errors');
        expect(res.body).to.have.keys(['status', 'errors']);
        done();
      });
  });

  it('should reject if the length of the comment exceed 250 characters', (done) => {
    requestObject.comment = 'In one lightning fast movement, the old crocodile bolted out of the water, wrapped his jaws around the great wildebeest and pulled him under the river. Awestruck the young crocodile swam up with the tiny bird hanging lightning fast movement, the old crocodile bolted out of the water, wrapped his jaws around the great wildebeest and pulled him under the river. Awestruck the young crocodile swam up with the tiny bird hanging lightning fast movement, the old crocodile bolted out of the water, wrapped his jaws around the great wildebeest and pulled him under the river. Awestruck the young crocodile swam up with the tiny bird hanging lightning fast movement, the old crocodile bolted out of the water, wrapped his jaws around the great wildebeest and pulled him under the river. Awestruck the young crocodile swam up with the tiny bird hanging lightning fast movement, the old crocodile bolted out of the water, wrapped his jaws around the great wildebeest and pulled him under the river. Awestruck the young crocodile swam up with the tiny bird hanging.'
    request(app)
      .post(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('authorization', userToken)
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('errors');
        expect(res.body).to.have.keys(['status', 'errors']);
        done();
      });
  });
});

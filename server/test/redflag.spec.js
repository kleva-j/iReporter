import { use, request } from 'chai';
import { expect } from 'chai';
import chaiHTTP from 'chai-http';
import app from '../../server/app';
import db from '../models/db';
import { encrypt } from '../utils/crypto';
import jwt from 'jsonwebtoken';
import dotenv  from 'dotenv';

dotenv.config();

const { log } = console;

use(chaiHTTP);

const url = '/api/v1/red-flags';

describe('RED_FLAGS', () => {

  let userToken, incident;
  before(async () => {
    try {
      await db.query('DELETE FROM users')
      const password = encrypt('password');
      await db.users.createUser({
        firstname: 'firstname',
        lastname: 'lastname',
        username: 'username',
        email: 'email@email.com',
        password,
        phonenumber: '08064477211',
        isadmin: false
      });
      const userDetails = await db.users.getByUsername('username');
      userToken = jwt.sign({
        userId: userDetails.id,
        username: userDetails.username,
        email: userDetails.email,
        isadmin: userDetails.isadmin
      }, process.env.SECRET_KEY, { expiresIn: '1 day' });

      incident = await db.incidents.createIncident({
        createdby: userDetails.id,
        type: 'red-flag',
        location: '2.1111,3.1111',
        images: [],
        videos: [],
        comment: 'blah'
      });

    } catch(error) {
      console.log(error);
    }
  });

  describe('Get all red flag records', () => {
    it('should return all red-flag records', (done) => {
      request(app)
        .get(url)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.eq(200);
          expect(res.body).to.have.keys(['status', 'data']);
          expect(res.body.data).to.be.instanceOf(Array);
          done();
        });
    });
  });

  describe('Get a specific red flag record', () => {
    it('should return a specific red-flag records', (done) => {
      const id = incident.id;
      request(app)
        .get(`${url}/${id}`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.keys(['status', 'data']);
          expect(res.body.data).to.be.instanceOf(Array);
          done();
        });
    });

    //id not found
    it('should raise a 404 not found', (done) => {
      const id = 1000;
      request(app)
        .get(`${url}/${id}`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error').to.eq(`Red-flag with id of ${id} was not found`);
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

    // id not recognised
    it('should report id is not a number', (done) => {
      const id = 'aaa';
      request(app)
        .get(`${url}/${id}`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').to.eq('red-flag Id should be a number');
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

  });

  describe('Update the location of a specific red-flag record', () => {
    it.skip("should update a red-flag record's location", (done) => {
      const id = incident.id;
      request(app)
        .patch(`${url}/${id}/location`)
        .set('x-access-token', userToken)
        .send({
          location: '45, 180'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.data[0]).to.have.property('message').to.eq('Updated red-flag record’s location');
          expect(res.body.data[0]).to.have.keys(['id', 'message']);
          expect(res.body.data).to.be.instanceOf(Array);
          done();
        });
    });

    
    // validate ID 
    //passed
    it('should reject if location format is not a string', (done) => {
      const id = incident.id;
      request(app)
        .patch(`${url}/${id}/location`)
        .set('x-access-token', userToken)
        .send({
          location: 11.22
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').to.eq(`Geographical coordinates are not well formated to a string`);
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

    //passed
    it('should reject if location is not found in the req.body object', (done) => {
      const id = incident.id;
      request(app)
        .patch(`${url}/${id}/location`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').to.eq(`Location is required`);
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

    //passed
    it('should reject if location is not a valid geo-coord', (done) => {
      const id = incident.id;
      request(app)
        .patch(`${url}/${id}/location`)
        .set('x-access-token', userToken)
        .send({
          location: '-90., -180.'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').to.eq(`Invalid coordinates`);
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

    //passed
    it('should report id is not a number', (done) => {
      const id = 'aaa';
      request(app)
        .patch(`${url}/${id}/location`)
        .set('x-access-token', userToken)
        .send({
          location: '45, 180'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').to.eq(`red-flag Id should be a number`);
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

    //passed
    it('should respond with a 404 not found error', (done) => {
      const id = 1000;
      request(app)
        .patch(`${url}/${id}/location`)
        .set('x-access-token', userToken)
        .send({
          location: '45, 180'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error').to.eq(`Record with id of ${id} was not found`);
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });
  });

  describe('Update the comment of a specific red-flag record', () => {
    it.skip('should update the red-flag comment', (done) => {
      const id = incident.id;
      request(app)
        .patch(`${url}/${id}/comment`)
        .set('x-access-token', userToken)
        .send({
          comment: 'this is the iReporter incident report'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.data[0]).to.have.property('message').to.eq('Updated red-flag record’s comment');
          expect(res.body.data[0]).to.have.keys(['id', 'message']);
          expect(res.body).to.have.keys(['status', 'data']);
          expect(res.body.data).to.be.instanceOf(Array);
          done();
        });

    });

    it('should report id is not a number', (done) => {
      const id = 'aaa';
      request(app)
        .patch(`${url}/${id}/comment`)
        .set('x-access-token', userToken)
        .send({
          comment: 'this is the iReporter incident report'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').to.eq(`red-flag Id should be a number`);
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

    it('should return a 404 not found error', (done) => {
      const id = 1000;
      request(app)
        .patch(`${url}/${id}/comment`)
        .set('x-access-token', userToken)
        .send({
          comment: 'this is the iRepoter incident update'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error').to.eq(`Record with id of ${id} was not found`);
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

    it('should reject if comment is not found in the body of the request object', (done) => {
      const id = incident.id;
      request(app)
        .patch(`${url}/${id}/comment`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').to.eq(`Comment is required`);
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

  });

  describe('Delete a specific red-flag record', () => {
    it('should delete a specific red-flag', (done) => {
      const id = incident.id;
      request(app)
        .delete(`${url}/${id}`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.data[0]).to.have.property('message').to.eq(`red-flag record with id of ${id} has been deleted successfully`);
          expect(res.body.data[0]).to.have.keys(['id', 'message']);
          expect(res.body).to.have.keys(['status', 'data']);
          expect(res.body.data).to.be.instanceOf(Array);
          done();
        });
    });

    it('should raise a 404 not found error', (done) => {
      const id = 1000;
      request(app)
        .delete(`${url}/${id}`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error').to.eq(`Record with id of ${id} was not found`);
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

    // id not recognised
    it('should report id is not a number', (done) => {
      const id = 'aaa';
      request(app)
        .get(`${url}/${id}`)
        .set('x-access-token', userToken)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').to.eq('red-flag Id should be a number');
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

  });

});

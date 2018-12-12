import { use, request } from 'chai';
import { expect } from 'chai';
import chaiHTTP from 'chai-http';
import app from '../../server/app';
import db from '../models/db';
import { QueryFile } from 'pg-promise';
import path from 'path';

const { log } = console;

use(chaiHTTP);

const url = '/api/v1/red-flags';

describe('RED_FLAGS', () => {

  // before((done) => {

  //   const qs = file => new QueryFile(path.join(__dirname, file), { minify: true });

  //   db.task('create data items', t => t.query(qs('createIncident.sql'))
  //     .then(() => {
  //       log('User records created');
  //       return t.query(qs('createUser.sql'))
  //       .then(() => {
  //         log('Incident records added')
  //         done();
  //       })
  //     }));
  // });

  describe('Get all red flag records', () => {
    it('should return all red-flag records', (done) => {
      request(app)
        .get(url)
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
    it.skip('should return a specific red-flag records', (done) => {
      const id = 1;
      request(app)
        .get(`${url}/${id}`)
        .end((err, res) => {
          expect(err).to.be.null;
          log(res.text)
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
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').to.eq('red-flag Id should be a number');
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

  });

  describe('Delete a specific red-flag record', () => {
    it.skip('should delete a specific red-flag', (done) => {
      request(app)
        .delete(`${url}/1`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.data[0]).to.have.property('message').to.eq('red-flag record has been deleted');
          expect(res.body.data[0]).to.have.keys(['id', 'message']);
          expect(res.body).to.have.keys(['status', 'data']);
          expect(res.body.data).to.be.instanceOf(Array);
          done();
        });
    });

    it.skip('should raise a 404 not found error', (done) => {
      const id = 1000;
      request(app)
        .delete(`${url}/${id}`)
        .end((err, res) => {
          expect(err).to.be.null;
          log(res);
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
      const id = 3;
      request(app)
        .patch(`${url}/${id}/location`)
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
      const id = 1;
      request(app)
        .patch(`${url}/${id}/location`)
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
      const id = 1;
      request(app)
        .patch(`${url}/${id}/location`)
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
      const id = 1;
      request(app)
        .patch(`${url}/${id}/location`)
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
    it.skip('should respond with a 404 not found error', (done) => {
      const id = 1000;
      request(app)
        .patch(`${url}/${id}/location`)
        .send({
          location: '45, 180'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error').to.eq(`Red-flag with id of ${id} was not found`);
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });
  });

  describe('Update the comment of a specific red-flag record', () => {
    it.skip('should update the red-flag comment', (done) => {
      const id = 2;
      request(app)
        .patch(`${url}/${id}/comment`)
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

    it.skip('should return a 404 not found error', (done) => {
      const id = 1000;
      request(app)
        .patch(`${url}/${id}/comment`)
        .send({
          comment: 'this is the iRepoter incident update'
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error').to.eq(`Red-flag with id of ${id} was not found`);
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

    it('should reject if comment is not found in the body of the request object', (done) => {
      const id = 1;
      request(app)
        .patch(`${url}/${id}/comment`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').to.eq(`Comment is required`);
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

  });

});

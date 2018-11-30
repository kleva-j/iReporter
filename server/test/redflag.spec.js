import chai, { expect } from 'chai';
import chaiHTTP from 'chai-http';
import app from '../../server/app';

chai.use(chaiHTTP);

const url = '/api/v1/red-flags';
const hostname = 'http://localhost:2080';

describe('RED_FLAGS', () => {

  describe.skip('Create a red-flag record', () => {
    const requestObject = {
      createdOn: new Date().toString(),
      createdBy: 1,
      type: 'red-flag',
      location: '6.111111, 3.222222',
      images: ['www.someImageUrl.com', 'www.someImageUrl.com'],
      videos: ['www.someVideoUrl.com', 'www.someVideoUrl.com'],
      comment: 'this is the news report',
    };

    it('should create a new red-flag record', (done) => {
      chai.request(app)
        .post(url)
        .send(requestObject)
        .end((req, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.keys(['status', 'data']);
          expect(res.body.data).to.be.instanceOf(Array);
          expect(res.body.data).length.to.be(1);
          done();
        });
    });

  });

  describe('Get all red flag records', () => {
    it('should return all red-flag records', (done) => {
      chai.request(app)
        .get(url)
        .end((req, res) => {
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
      chai.request(app)
        .get(`${url}/1`)
        .end((req, res) => {
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
      chai.request(app)
        .get(`${url}/${id}`)
        .end((req, res) => {
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
      chai.request(app)
        .get(`${url}/${id}`)
        .end((req, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').to.eq('red-flag Id should be a number');
          expect(res.body).to.have.keys(['status', 'error']);
          done();
        });
    });

  });

  describe('Delete a specific red-flag record', () => {
    it('should delete a specific red-flag', (done) => {
      chai.request(app)
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

    it('should raise a 404 not found error', (done) => {
      const id = 1000;
      chai.request(app)
        .delete(`${url}/${id}`)
        .end((req, res) => {
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
      chai.request(app)
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
    it("should update a red-flag record's location", (done) => {
      const id = 3;
      chai.request(app)
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

    // ID number


    //passed
    it('should reject if location format is not a string', (done) => {
      const id = 1;
      chai.request(app)
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
      chai.request(app)
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
      chai.request(app)
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
      chai.request(app)
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
    it('should respond with a 404 not found error', (done) => {
      const id = 1000;
      chai.request(app)
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

  describe('Update the comment of a specific red-flag record', () => {});

})
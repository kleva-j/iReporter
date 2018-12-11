const chai = require('chai');
const { expect } = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../../server/app');

chai.use(chaiHTTP);

const url = '/api/v1/red-flags';

describe.skip('/POST - create a red-flag record', () => {
  let requestObject;
  beforeEach(() => {
    requestObject = {
      createdOn: new Date().toString(),
      createdBy: 1,
      type: 'red-flag',
      location: '6.111111, 3.222222',
      images: "[www.someImageUrl.jpg, www.someImageUrl.png]",
      videos: "[www.someVideoUrl.mp4, www.someVideoUrl.avi]",
      comment: 'this is the news report',
    };
  });

  // test creator id if exist
  it('should reject if creator id is not defined', (done) => {
    requestObject.createdBy = undefined;
    chai.request(app)
      .post(url)
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.eq('Red-flag creator id is not defined');
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
  });

  // test validity of creatorId
  it('should reject if creator id is not valid', (done) => {
    requestObject.createdBy = 'asdf';
    chai.request(app)
      .post(url)
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.eq('Red-flag creator id is not a valid id');
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
  });
  
  //validate type
  it('should reject if type is not defined', (done) => {
    requestObject.type = undefined;
    chai.request(app)
      .post(url)
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.eq('Type of incident not present');
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
  });

  it('should reject if type is not a red-flag or an intervention', (done) => {
    requestObject.type = 'asdf';
    chai.request(app)
      .post(url)
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.eq('Type of incident should either be a red-flag or an intervention');
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
  });

  // validate Images
  it('should reject if image source are not sent', (done) => {
    requestObject.images = undefined;
    chai.request(app)
    .post(url)  
    .send(requestObject)
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error').to.eq('Image evidence were not sent');
      expect(res.body).to.have.keys(['status', 'error']);
      done();
    });
  });

  it('should reject if image source do not end in either jpg, jpeg or png', (done) => {
    requestObject.images = 'undefined';
    chai.request(app)
    .post(url)  
    .send(requestObject)
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error').to.eq('Images should be a string with either of these extension formats jpg, png or jpeg');
      expect(res.body).to.have.keys(['status', 'error']);
      done();
    });
  });

  //validate Videos
  it('should reject if video source are not sent', (done) => {
    requestObject.videos = undefined;
    chai.request(app)
    .post(url)
    .send(requestObject)
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error').to.eq('Video evidences were not sent');
      expect(res.body).to.have.keys(['status', 'error']);
      done();
    });
  });

  it('should reject if video source do not end in either avi, mp4 or mkv', (done) => {
    requestObject.videos = 'undefined';
    chai.request(app)
    .post(url)  
    .send(requestObject)
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error').to.eq('Video urls should be a string datatype with endings of either avi, mkv or mp4');
      expect(res.body).to.have.keys(['status', 'error']);
      done();
    });
  });

  //validate comment 
  it('should report if comment is not sent', (done) => {
    requestObject.comment = undefined;
    chai.request(app)
      .post(url)
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.eq('Comment is required');
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
  });

  it('should return if comment is not a valid string datatype', (done) => {
    requestObject.comment = 1000;
    chai.request(app)
      .post(url)
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.eq('Comments should be a string type value');
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
  });

  it('should reject if the length of the comment exceed 350 characters', (done) => {
    requestObject.comment = 'In one lightning fast movement, the old crocodile bolted out of the water, wrapped his jaws around the great wildebeest and pulled him under the river. Awestruck the young crocodile swam up with the tiny bird hanging from his mouth and watched as the old crocodile enjoyed his 500 lb meal. In one lightning fast movement, the old crocodile bolted out of the water, wrapped his jaws around the great wildebeest and pulled him under the river. Awestruck the young crocodile swam up with the tiny bird hanging from his mouth and watched as the old crocodile enjoyed his 500 lb meal.'
    chai.request(app)
      .post(url)
      .send(requestObject)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.eq('Maximum number of word is 350 characters');
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
  });

});

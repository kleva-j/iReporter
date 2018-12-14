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

    } catch(error) {
      console.log(error);
    }
  });

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

  // 
  it('should create a red-flag', (done) => {
    request(app)
      .post(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('x-access-token', userToken)
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
        expect(res.body).to.have.property('message').eql('You are required to login to access this endpoint');
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
      .set('x-access-token', userToken)
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
    request(app)
      .post(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('x-access-token', userToken)
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
    request(app)
    .post(url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('x-access-token', userToken)
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
    request(app)
    .post(url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('x-access-token', userToken)
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
    request(app)
    .post(url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('x-access-token', userToken)
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
    request(app)
    .post(url)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('x-access-token', userToken)
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
    request(app)
      .post(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('x-access-token', userToken)
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
    request(app)
      .post(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('x-access-token', userToken)
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
    request(app)
      .post(url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('x-access-token', userToken)
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

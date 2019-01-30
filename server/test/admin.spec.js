const chai = require('chai');
const { expect } = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../../server/app');

chai.use(chaiHTTP);

const url = '/api/v1/red-flags';

describe.skip("/PATCH - admin can update the status of a user's record", () => {

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

  it("The Admin should be able to update a user's red-flag status", (done) => {
    const id = 1;
    chai.request(app)
      .patch(`${url}/${id}/status`)
      .set('authorization', `Bearer ${userToken}`)
      .send({
        status: 'resolved'
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.data[0]).to.have.property('message').to.eq("User's red-flag status has been updated");
        expect(res.body.data[0]).to.have.keys(['id', 'message']);
        expect(res.body).to.have.keys(['status', 'data']);
        expect(res.body.data).to.be.instanceOf(Array);
        done();
      });
  });

  it('should report if status is neither under investigation, rejected nor resolved', (done) => {
    const id = 2;
    chai.request(app)
      .patch(`${url}/${id}/status`)
      .send({
        status: 'bbb'
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.eq(`User red-flag status can either be under investigation, rejected or resolved`);
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
  });

  it('should report id is not a number', (done) => {
    const id = 'aaa';
    chai.request(app)
      .patch(`${url}/${id}/status`)
      .send({
        status: 'resolved'
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
    chai.request(app)
      .patch(`${url}/${id}/status`)
      .send({
        status: 'resolved'
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error').to.eq(`Red-flag with id of ${id} was not found`);
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
  });

  it('should reject if status is not found in the body of the request object', (done) => {
    const id = 1;
    chai.request(app)
      .patch(`${url}/${id}/status`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.eq('Status was not sent in the request');
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
  });

});

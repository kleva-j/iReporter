'use strict';

var chai = require('chai');
var expect = chai.expect;

var chaiHTTP = require('chai-http');

var _require = require('mocha'),
    describe = _require.describe;

var app = require('../../../dist/app');

chai.use(chaiHTTP);

var url = '/api/v1/red-flags';
var hostname = 'http://localhost:2080';

describe('RED_FLAGS', function () {

  describe.skip('Create a red-flag record', function () {
    var requestObject = {
      createdOn: new Date().toString(),
      createdBy: 1,
      type: 'red-flag',
      location: '6.111111, 3.222222',
      images: ['www.someImageUrl.com', 'www.someImageUrl.com'],
      videos: ['www.someVideoUrl.com', 'www.someVideoUrl.com'],
      comment: 'this is the news report'
    };

    it('should create a new red-flag record', function (done) {
      chai.request(hostname).post(url).send(requestObject).end(function (req, res) {
        console.log(req, res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.keys(['status', 'data']);
        expect(res.body.data).to.be.instanceOf(Array);
        expect(res.body.data).length.to.be(1);
        done();
      });
    });
  });

  describe('Get all red flag records', function () {
    it('should return all red-flag records', function (done) {
      chai.request(hostname).get(url).end(function (req, res) {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.keys(['status', 'data']);
        expect(res.body.data).to.be.instanceOf(Array);
        done();
      });
    });
  });

  describe('Get a specific red flag record', function () {
    it('should return a specific red-flag records', function (done) {
      chai.request(hostname).get(url + '/1').end(function (req, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.keys(['status', 'data']);
        expect(res.body.data).to.be.instanceOf(Array);
        done();
      });
    });

    //id not found
    it('should raise a 404 not found', function (done) {
      var id = 1000;
      chai.request(hostname).get(url + '/' + id).end(function (req, res) {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error').to.eq('Red-flag with id of ' + id + ' was not found');
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
    });

    // id not recognised
    it('should report id is not a number', function (done) {
      var id = 'aaa';
      chai.request(hostname).get(url + '/' + id).end(function (req, res) {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.eq('red-flag Id should be a number');
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
    });
  });

  describe('Delete a specific red-flag record', function () {
    it('should delete a specific red-flag', function (done) {
      chai.request(hostname).delete(url + '/1').end(function (req, res) {
        expect(res).to.have.status(200);
        expect(res.body.data[0]).to.have.property('message').to.eq('red-flag record has been deleted');
        expect(res.body.data[0]).to.have.keys(['id', 'message']);
        expect(res.body).to.have.keys(['status', 'data']);
        expect(res.body.data).to.be.instanceOf(Array);
        done();
      });
    });

    it('should raise a 404 not found error', function (done) {
      var id = 1000;
      chai.request(hostname).delete(url + '/' + id).end(function (req, res) {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error').to.eq('Red-flag with id of ' + id + ' was not found');
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
    });

    // id not recognised
    it('should report id is not a number', function (done) {
      var id = 'aaa';
      chai.request(hostname).get(url + '/' + id).end(function (req, res) {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.eq('red-flag Id should be a number');
        expect(res.body).to.have.keys(['status', 'error']);
        done();
      });
    });
  });

  describe('Update the location of a specific red-flag record', function () {});

  describe('Update the comment of a specific red-flag record', function () {});
});
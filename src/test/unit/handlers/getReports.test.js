
const { assert, expect } = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const fixtures = require('../../fixtures');
const api = require('../../../index');

describe('GET /api/reports', function () {
  let sandbox;
  let request;
  let getReports;
  let client;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    request = supertest(api)
      .get('/api/reports')
      .set({'api-key': 'K5A2D3S8T388N684Q7J182V46856L672Q9Y9A9E0'});
    getReports = sandbox.replace(api.DB.Report, 'findPaginated', function () {
      return Promise.resolve(fixtures.DB.reports.all);
    });
    client = sandbox.replace(api.DB.Client, 'findOne', function () {
      return Promise.resolve(fixtures.DB.clients.all[0]);
    });
  });
  afterEach(function () {
    sandbox.restore();
  });
  describe('[SUCCESS] Reponse', function () {
    it('should return 200', function (done) {
      request
        .send()
        .expect(200)
        .end(done);
    });
    it('should return all reports', function (done) {
      request
        .send()
        .expect(function (res) {
          expect(res.body.status).to.equal('SUCCESS');
          expect(res.body.statusCode).to.equal(0);
        })
        .expect(200)
        .end(done);
    });
  });
  describe('[ERROR] Response - No API KEY', function () {
    beforeEach(function () {
      request = supertest(api)
        .get('/api/reports');
    });
    it('should return 401', function (done) {
      request
        .send()
        .expect(401)
        .end(done);
    });
    it('.headers[api-key] is missing', function (done) {
      request
        .send()
        .expect(function (res) {
          expect(res.body.status).to.equal('ERROR');
          expect(res.body.statusCode).to.equal(3);
        })
        .expect(401)
        .end(done);
    });
  });
  describe('[ERROR] Response - Invalid Client API KEY', function () {
    beforeEach(function () {
      sandbox.restore();
      client = sandbox.replace(api.DB.Client, 'findOne', function () {
        return Promise.resolve(null);
      });
    });
    it('should return 401', function (done) {
      request
        .send()
        .expect(401)
        .end(done);
    });
    it('.headers[api-key] is missing', function (done) {
      request
        .send()
        .expect(function (res) {
          expect(res.body.status).to.equal('ERROR');
          expect(res.body.statusCode).to.equal(3);
        })
        .expect(401)
        .end(done);
    });
  });
  describe('[ERROR] Response - Invalid Client API KEY', function () {
    beforeEach(function () {
      sandbox.restore();
      client = sandbox.replace(api.DB.Client, 'findOne', function () {
        return Promise.reject(new Error('test error'));
      });
    });
    it('should return 401', function (done) {
      request
        .send()
        .expect(500)
        .end(done);
    });
    it('.headers[api-key] is missing', function (done) {
      request
        .send()
        .expect(function (res) {
          expect(res.body.status).to.equal('ERROR');
          expect(res.body.statusCode).to.equal(5);
        })
        .expect(500)
        .end(done);
    });
  });
});

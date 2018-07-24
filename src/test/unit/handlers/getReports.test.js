
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
      .get('/api/reports');
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
});

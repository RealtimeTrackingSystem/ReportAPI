
import { assert, expect } from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';
import fixtures from '../../fixtures';
import api from '../../../index';

describe('GET /api/reports', function () {
  let sandbox;
  let request;
  let getReports;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    request = supertest(api)
      .get('/api/reports');
    getReports = sandbox.replace(api.DB.Report, 'find', function () {
      return Promise.resolve(fixtures.DB.reports.all);
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

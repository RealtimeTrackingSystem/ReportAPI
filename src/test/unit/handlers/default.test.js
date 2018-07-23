
const { expect } = require('chai');
const supertest = require('supertest');
const api = require('../../../index');

describe('GET /echo', function () {
  let request;

  beforeEach(function () {
    request = supertest(api)
      .get('/echo');
  });
  describe('[SUCCESS] Reponse', function () {
    it('should return all reports', function (done) {
      request
        .send()
        .expect(function (res) {
          expect(res.body.statusCode).to.equal(0);
        })
        .expect(200)
        .end(done);
    });
  });
  describe('[ERROR] Response', function () {
    beforeEach(function () {
      request = supertest(api)
        .get('/unknown/route');
    });
    it('should return an invalid message prompt', function (done) {
      request
        .send()
        .expect(404)
        .end(done);
    });
  });
});

const { assert, expect } = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const fixtures = require('../../fixtures');
const api = require('../../../index');

describe('POST /api/clients', function () {
  let sandbox;
  let requrest;
  let checkDuplicateStub;
  let clienFindOneStub;
  let orgAddStub;
  let clientAddStub;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
  });
  afterEach(function () {
    sandbox.restore();
  });
  describe('[SUCCESS] Response', function () {
    
  });
});

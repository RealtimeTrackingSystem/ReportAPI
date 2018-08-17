const { expect } = require('chai');
const supertest = require('supertest');
const assets = require('../../../assets');

describe('Assets - mailtemplates', function () {
  let mailtemplates;
  let client;
  let org;
  beforeEach(function () {
    mailtemplates = assets.mailtemplates;
    client = {
      email: 'testClient@domain.com',
      subscriptionType: 'FREE',
      apiKey: 'asdf3sdkf348394rajdlkfnq439t'
    };
    org = {
      name: 'ORG NAME'
    };
  });
  describe('SEND API KEY TEMPLATE', function () {
    it('should return the right template for SEND API KEY TEMPLATE', function (done) {
      mailtemplates.sendAPIKey(client, org);
      done();
    });

    it('should return the right template for SEND API KEY TEMPLATE even without org', function (done) {
      org = null;
      mailtemplates.sendAPIKey(client, org);
      done();
    });
  });
});

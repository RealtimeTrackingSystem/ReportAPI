const DB = require('../../../models');
const Client = DB.Client;

const all = [
  new Client({
    '_id' : '5b5605dfdc1a360d1d028a83',
    'subscriptionType' : 'FREE',
    'email' : 'client5@test.com',
    'password' : '$2a$10$Z5Yp.ndLS8WzKKqPeP7c/ezSVPfPwgo.y6pxMT5SxK3buvqJJP8bW', // clienttestpassword
    'apiKey' : 'P892129721Z5M617G1U3Y518Z05654X015Z1K1T1',
    'createdAt' : '2018-07-23T16:44:15.389Z',
    'updatedAt' : '2018-07-23T16:44:15.389Z',
    '__v' : 0
  }),
  new Client({
    '_id' : '5b5605ac709d7f0cf33f4fdc',
    'subscriptionType' : 'FREE',
    'email' : 'client4@test.com',
    'password' : '$2a$10$RNHMBaQ0/S3US9eYRhD0V.P5XbIVMEnaDyF.e6ChAW3dIY7XvEO1O', // clienttestpassword
    'apiKey' : 'X7Z5Q8A7U4R28967G3J52016U6L1F0C3B2Q5M1C2',
    'createdAt' : '2018-07-23T16:43:24.430Z',
    'updatedAt' : '2018-07-23T16:43:24.430Z'
  })
];

module.exports = {
  all
};

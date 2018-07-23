import bcrypt from 'bcrypt-nodejs';
import codeGen from 'node-code-generator';
import jwt from 'jwt-simple';
import Promise from 'bluebird';
import CONFIG from '../config';

function genSalt (num) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(num, function (err, salt) {
      if (err) {
        return reject(err);
      }
      resolve(salt);
    });
  });
}

function hash (stringValue, salt) {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(stringValue, salt, null, function (err, hashedString) {
      if (err) {
        return reject(err);
      }
      resolve(hashedString);
    });
  });
}

function compareHash (password, hashedPassword) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(password, hashedPassword, function (err, isMatch) {
      if (err) {
        return reject(false);
      }
      resolve(isMatch);
    });
  });
}

function hashAndSalt (stringValue) {
  return genSalt(CONFIG.SALT)
    .then(function (salt) {
      return hash(stringValue, salt);
    });
}

function codeGenerator (pattern = '', num = 1, options = {}) {
  const generator = new codeGen();
  return generator.generateCodes(pattern, num, options);
}

function encodeToken (payload) {
  return jwt.encode(payload, CONFIG.SECRET_KEY);
}

function decodeToken (token) {
  return jwt.decode(token, CONFIG.SECRET_KEY);
}

export default {
  genSalt,
  hash,
  compareHash,
  hashAndSalt,
  codeGenerator,
  encodeToken,
  decodeToken
};

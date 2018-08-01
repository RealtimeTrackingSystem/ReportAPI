const mongoose = require('mongoose');
const redis = require('redis');
const Promise = require('bluebird');

const CONFIG = require('../config')[process.env.NODE_MODULES || 'development'];

const redisURL = CONFIG.REDIS_URL;
const client = redis.createClient(redisURL);
client.get = Promise.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key, 'base64');
  this.expiration = options.expiration || 10;
  return this;
}

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  key = this.hashKey;
  const cachedValue = await client.get(key);
  if (cachedValue) {
    const doc = JSON.parse(cachedValue);
    
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }
  const result = await exec.apply(this, arguments);
  client.set(key, JSON.stringify(result), 'EX', this.expiration);
  return result;
};

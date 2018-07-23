const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'Report - API'
});

if (process.env.NODE_ENV === 'test') {
  logger.level(bunyan.FATAL + 1);
}

module.exports = logger;

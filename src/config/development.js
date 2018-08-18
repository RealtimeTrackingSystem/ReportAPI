const CONFIG = {
  DATABASE: 'mongodb://localhost:27017/reportApiDb',
  REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  LOG: {
    env: 'dev'
  },
  SALT: 10,
  SECRET_KEY: 'thesupersecretkey',
  SENDGRID: {
    SENDGRID_API_KEY: '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',//process.env.SENDGRID_API_KEY,
    SENDGRID_PASSWORD: process.env.SENDGRID_PASSWORD,
    SENDGRID_USERNAME: process.env.SENDGRID_USERNAME
  }
};

module.exports = CONFIG;

const CONFIG = {
  DATABASE: 'mongodb://localhost:27017/reportApiDb',
  LOG: {
    env: 'dev'
  },
  SALT: 10,
  SECRET_KEY: 'thesupersecretkey',
  SENDGRID: {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_PASSWORD: process.env.SENDGRID_PASSWORD,
    SENDGRID_USERNAME: process.env.SENDGRID_USERNAME
  }
};

module.exports = CONFIG;

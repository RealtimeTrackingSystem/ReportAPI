const CONFIG = {
  DATABASE: 'mongodb://localhost:27017/reportApiDb',
  LOG: {
    env: 'dev'
  },
  SALT: 10,
  SECRET_KEY: 'thesupersecretkey'
};

module.exports = CONFIG;

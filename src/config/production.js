const CONFIG = {
  DATABASE: process.env.DATABASE || 'mongodb://localhost:27017/reportApiDbProd',
  LOG: {
    env: process.env.LOG_ENV || 'prod'
  },
  SALT: process.env.SALT || 10,
  SECRET_KEY: process.env.SECRET_KEY || 'thesupersecretkey'
};

module.exports = CONFIG;

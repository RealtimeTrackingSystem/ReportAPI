const CONFIG = {
  db: {
    HOST: process.env.DB_HOST || '127.0.0.1',
    PORT: process.env.DB_PORT || '27017',
    DATABASE: process.env.DATABASE || 'reportApiDb2',
    MONGO_INITDB_ROOT_USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME,
    MONGO_INITDB_ROOT_PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  LOG: {
    env: 'dev'
  },
  SALT: 10,
  SECRET_KEY: 'thesupersecretkey',
  SENDGRID: {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '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',
    SENDGRID_PASSWORD: process.env.SENDGRID_PASSWORD || 'zlvmvall6181',
    SENDGRID_USERNAME: process.env.SENDGRID_USERNAME || 'app113302926@heroku.com'
  }
};

module.exports = CONFIG;

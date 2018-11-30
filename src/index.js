const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const validator = require('express-validator');
const morgan = require('morgan');
const logger = require('morgan');

// loading .env file for non production env
/* istanbul ignore next */
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').load();
// }


const routes = require('./routes');
const DB = require('./models');
const CONFIG = require('./config');
const lib = require('./lib');

// set up express app
const app = express();
const env = process.env.NODE_ENV;
const config = CONFIG[env];

// connect MongoDB
require('./models');
/* istanbul ignore next */
if (config.redis.port && config.redis.host) {
  require('./lib/cache');
}

const connectionString = 'mongodb://' + config.db.HOST + ':' + config.db.PORT + '/' + config.db.DATABASE;
console.log('connection string: ', connectionString);
mongoose.connect(connectionString, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.DB = DB;

const PORT = process.env.PORT || 5000;

app.use(logger(config.LOG.env));
if (process.env.NODE_ENV.indexOf('test') < 0) {
  app.use(morgan('combined'));
}

// Cors
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Api-Key');
  next();
});

// use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express-validator
app.use(validator({
  customValidators: lib.customValidators
}));

// adding req variables
app.use(function (req, res, next) {
  req.logger = {};
  req.logger = lib.logger;
  req.mailer = lib.mailer;
  req.$scope = {};
  req.DB = DB;
  next();
});


// initialize routes
routes(app);

// listen for requests

app.get('/echo', function (req, res) {
  res.send('SUCCESS!');
});

app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});

module.exports = app;

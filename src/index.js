const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const validator = require('express-validator');
const morgan = require('morgan');
const logger = require('morgan');

// loading .env file for non production env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const routes = require('./routes');
const DB = require('./models');
const CONFIG = require('./config');
const lib = require('./lib');

// set up express app
const app = express();
const config = CONFIG[process.env.NODE_ENV || 'development'];

// connect MongoDB
require('./models');
if (config.REDIS_URL) {
  require('./lib/cache');
}
mongoose.connect(config.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const PORT = process.env.PORT || 5000;

app.DB = DB;

app.use(logger(config.LOG.env));
app.use(morgan('combined'));

// Cors
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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
app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});

module.exports = app;

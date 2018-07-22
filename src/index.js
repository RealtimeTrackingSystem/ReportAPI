import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import logger from 'morgan';

import routes from './routes';
import DB from './models';
import CONFIG from './config';
import lib from './lib';

// set up express app
const app = express();
const config = CONFIG[process.env.NODE_ENV || 'development'];

// connect MongoDB
mongoose.connect(config.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const PORT = process.env.PORT || 5000;

app.DB = DB;

app.use(logger(config.LOG.env));
app.use(morgan('combined'));

// use body-parser middleware
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  req.logger = {};
  req.logger = lib.logger;
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

export default app;

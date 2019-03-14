const lib = require('../../lib');

const internals = {};

internals.catchError = (err, req, res) => {
  const error = {
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  };
  // req.logger.error(err, 'POST /api/reporters/firebaseToken');
  res.status(error.httpCode).send(error);
};

function validateBody (req, res, next) {
  const schema = {
    reporterId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Repoter Id'
    },
    deviceId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Device Id'
    },
    token: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Token'
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    // req.logger.warn('POST /api/reporters/firebaseToken', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function validateReporter (req, res, next) {
  const reporterId = req.body.reporterId;
  return req.DB.Reporter.findOne({ _id: reporterId })
    .then((reporter) => {
      if (!reporter) {
        const error = {
          status: 'ERROR',
          statusCode: 3,
          httpCode: 400,
          message: 'Invalid Parameter: Reporter Id'
        };
        return res.status(error.httpCode).send(error);
      }
      next();
    })
    .catch(err => internals.catchError(err, req, res));
}

function logic (req, res) {
  const { reporterId, deviceId, token } = req.body;
  return req.DB.Reporter.addOrUpdateDevice({ reporterId, deviceId, token })
    .then(reporter => {
      const response = {
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 201,
        reporter: reporter._id
      };
      res.status(response.httpCode).send(response);
    })
    .catch(err => internals.catchError(err, req, res));
}


module.exports = {
  validateBody,
  validateReporter,
  logic
};

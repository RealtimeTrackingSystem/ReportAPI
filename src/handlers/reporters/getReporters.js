const lib = require('../../lib');

function validateQuery (req, res, next) {
  const schema = {
    limit: {
      optional: true,
      isInt: {
        errorMessage: 'Invalid Parameter: Limit'
      }
    },
    page: {
      optional: true,
      isInt: {
        errorMessage: 'Invalid Parameter: Page'
      }
    }
  };
  req.checkQuery(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    // req.logger.warn('GET /api/reports', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function logic (req, res) {
  const limit = parseInt(req.query.limit) || 30;
  const page = parseInt(req.query.page) || 0;
  return req.DB.Reporter.findPaginated({}, page, limit)
    .then(function (reporters) {
      res.status(200).send({
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 200,
        reports: reporters
      });
    })
    .catch(function (err) {
      // req.logger.error(err, 'GET /api/reporters');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

module.exports = {
  validateQuery,
  logic
};

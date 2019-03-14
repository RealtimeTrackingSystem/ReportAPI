const lib = require('../../lib');

function validateParams (req, res, next) {
  const reporterId = req.params.reporterId;
  if (!lib.customValidators.isObjectId(reporterId)) {
    const error = {
      status: 'ERROR',
      statusCode: 1,
      httpCode: 400,
      message: 'Invalid Parameter: Reporter ID'
    };
    // req.logger.warn(error, 'GET /api/reporters/:reporterId');
    return res.status(error.httpCode).send(error);
  }
  next();
}

function logic (req, res, next) {
  const reporterId = req.params.reporterId;
  return req.DB.Reporter.findById(reporterId)
    .then(function (reporter) {
      req.$scope.reporter = reporter;
      next();
    })
    .catch(function (err) {
      // req.logger.error(err, 'PUT /api/reports/:reportId');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function respond (req, res) {
  // req.logger.info(req.$scope.reporter ? req.$scope.reporter.toObject() : null, 'PUT /api/reporters/:reporterId');
  res.status(200).send({
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    reporter: req.$scope.reporter
  });
}

module.exports = {
  validateParams,
  logic,
  respond
};

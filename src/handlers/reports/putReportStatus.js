const lib = require('../../lib');

function validateBody (req, res, next) {
  const schema = {
    status: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Status'
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn(errorObject, 'PUT /api/reports/status/:reportId');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }

}

function validateStatus (req, res, next) {
  const status = req.body.status;
  const reportId = req.params.reportId;
  return req.DB.Report.statusCanBeUpdated(reportId, status)
    .then(function (result) {
      req.$scope.report = result;
      return next();
    })
    .catch(function (err) {
      if (err.httpCode) {
        return res.status(err.httpCode).send(err);
      }
      req.logger.error(err, 'PUT /api/reports/status/:reportId');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function logic (req, res, next) {
  const status = req.body.status;
  const reportId = req.params.reportId;
  return req.DB.Report.updateStatus(reportId, status)
    .then(function (result) {
      req.$scope.report = result;
      return next();
    })
    .catch(function (err) {
      if (err.httpCode) {
        return res.status(err.httpCode).send(err);
      }
      req.logger.error(err, 'PUT /api/reports/status/:reportId');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function respond (req, res) {
  res.status(201).send({
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201,
    report: req.$scope.report
  });
}

module.exports = {
  validateBody,
  validateStatus,
  logic,
  respond
};

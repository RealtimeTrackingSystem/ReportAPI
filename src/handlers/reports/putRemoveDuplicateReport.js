const lib = require('../../lib');


function validateBody (req, res, next) {
  const schema = {
    duplicate: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Duplicate Report'
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn(errorObject, 'PUT /api/reports/duplicates');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }

}

function validateReportId (req, res, next) {
  const { duplicate } = req.body;
  let error;
  if (!lib.customValidators.isObjectId(duplicate)) {
    error = {
      status: 'ERROR',
      statusCode: 3,
      httpCode: 400,
      message: 'Invalid Parameter: Duplicate Report -> Invalid ID'
    };
  }

  if (error) {
    req.logger.warn(error, 'PUT /api/reports/duplicates');
    return res.status(error.httpCode).send(error);
  }

  next();
}

function logic (req, res) {
  const { duplicate } = req.body;
  return req.DB.Report.removeDuplicateReport(duplicate)
    .then(result => {
      const response = {
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 201
      };
      req.logger.info(result, 'PUT /api/reports/duplicates');
      res.status(response.httpCode).send(response);
    })
    .catch(err => {
      let error;
      if (err.message) {
        req.logger.warn(err, 'PUT /api/reports/duplicates');
        error = {
          status: 'ERROR',
          statusCode: 3,
          httpCode: 400,
          message: err.message
        };
      } else {
        req.logger.error(err, 'PUT /api/reports/duplicates');
        error = {
          status: 'ERROR',
          statusCode: 1,
          httpCode: 500,
          message: 'Internal Server Error'
        };
      }
      res.status(error.httpCode).send(error);
    });
}

module.exports = {
  validateBody,
  validateReportId,
  logic
};

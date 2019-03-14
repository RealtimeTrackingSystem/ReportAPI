
const internals = {};
internals.catchServerError = function (error, req, res) {
  // req.logger.error(error, 'PUT /api/reporters/:reporterId');
  res.status(500).send({
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  });
};
function validateReporter (req, res, next) {
  const reporterId = req.params.reporterId;
  req.DB.Reporter.findById(reporterId)
    .then(reporter => {
      if (!reporter) {
        const error = {
          status: 'ERROR',
          statusCode: 3,
          httpCode: 400,
          message: 'Invalid Parameter: Reporter ID'
        };
        // req.logger.warn(error, 'PUT /api/reporters/:reporterId');
        return res.status(error.httpCode).send(error);
      }
      next();
    })
    .catch(err => internals.catchServerError(err, req, res));
}

function logic (req, res, next) {
  const reporterId = req.params.reporterId;
  const reporter = req.body;
  const reporterData = {
    fname: reporter.fname,
    lname: reporter.lname,
    email: reporter.email,
    birthday: reporter.birthday,
    gender: reporter.gender,
    alias: reporter.alias,
    street: reporter.street,
    barangay: reporter.barangay,
    city: reporter.city,
    region: reporter.region,
    country: reporter.country,
    zip: reporter.zip
  };
  req.DB.Reporter.findByIdAndUpdate(reporterId, reporterData)
    .then(reporter => {
      req.$scope.reporter = reporter;
      next();
    })
    .catch(err => internals.catchServerError(err, req, res));
}

function respond (req, res) {
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201,
    reporter: req.$scope.reporter._id
  };
  // req.logger.info(response, 'PUT /api/reporters/:reporterId');
  res.status(response.httpCode).send(response);
}

module.exports = {
  validateReporter,
  logic,
  respond
};

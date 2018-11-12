const Promise = require('bluebird');
const Report = require('../../models/Report');

const internals = {};
internals.duplicateReportIterator = function ({ originalReport, duplicateReport}) {
  return new Promise((resolve) => {
    return Report.duplicateReport(originalReport, duplicateReport)
      .spread()
      .then((origReport, dupReport) => {
        resolve({
          originalReport: origReport,
          duplicateReport: dupReport
        });
      })
      .catch(function (err) {
        resolve({ error: err });
      });
  });
};
// check parameters
function validateParams (req, res, next) {
  const duplicates = req.body.duplicates;
  const error = {
    status: 'ERROR',
    httpCode: 400
  };
  if (!duplicates) {
    error.statusCode = 2;
    error.message = 'Missing Parameter: Duplicates';
  }
  if (!Array.isArray(duplicates) || duplicates.length < 1) {
    error.statusCode = 3;
    error.message = 'Invalid Parameter: Duplicates';
  }
  if (error.statusCode) {
    req.logger.warn(error, 'POST /api/reports/duplicates');
    return res.status(error.httpCode).send(error);
  }
  next();
}

// set as duplicate
function duplicate (req, res, next) {
  const duplicates = req.body.duplicates;
  if (duplicates.length === 1) {
    req.$scope.massDuplication = false;
    const duplicate = duplicates[0];
    return req.DB.Report.duplicateReport(duplicate.originalReport, duplicate.duplicateReport)
      .spread((originalReport, duplicateReport) => {
        req.logger.info({
          originalReport, duplicateReport
        }, 'POST /api/reports/duplicates');
        next();
      })
      .catch((err) => {
        let response;
        if (err.success === false) {
          response = {
            status: 'ERROR',
            statusCode: 3,
            httpCode : 400,
            message: err.reason
          };
          req.logger.warn(response, 'POST /api/reports/duplicates');
        } else if (err.success) {
          response = {
            status: 'SUCCESS',
            statusCode: 0,
            httpCode: 201
          };
          req.logger.info(response, 'POST /api/reports/duplicates');
        } else {
          req.logger.error(err, 'POST /api/reports/duplicates');
          response = {
            status: 'ERROR',
            statusCode: 1,
            httpCode: 500,
            message: 'Internal Server Error'
          };
        }
        res.status(response.httpCode).send(response);
      });
  } else {
    req.$scope.massDuplication = true;
    return Promise.map(duplicates, internals.duplicateReportIterator)
      .then((results) => {
        req.logger.info({
          results
        }, 'POST /api/reports/duplicates');
        next();
      })
      .catch((err) => {
        req.logger.error(err, 'POST /api/reports/duplicates');
        res.status(500).send({
          status: 'ERROR',
          statusCode: 1,
          httpCode: 500,
          message: 'Internal Server Error'
        });
      });
  }
}


// send email notification
function sendEmail (req, res, next) {
  // @TODO update thil middleware
  next();
}


// respond
function respond (req, res) {
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  };
  res.status(response.httpCode).send(response);
}

module.exports = {
  validateParams,
  duplicate,
  sendEmail,
  respond
};

const Report = require('../../models/Report');
const Promise = require('bluebird');
const _ = require('lodash');

const internals = {};

internals.checkReportToUpdate = function ({reportId, status, _note}) {
  return new Promise((resolve) => {
    Report.statusCanBeUpdated(reportId, status)
      .then(() => {
        resolve({
          reportId: reportId,
          status: status,
          _note: _note,
          update: true
        });
      })
      .catch(() => {
        resolve({
          reportId: reportId,
          status: status,
          update: false
        });
      });
  });
};

internals.massUpdateStatus = function ({reportId, status, _note}) {
  return new Promise((resolve) => {
    Report.updateStatus(reportId, status, _note)
      .then((report) => {
        resolve(report);
      })
      .catch(() => {
        resolve({ error: true });
      });
  });
};

function validateParams (req, res, next) {
  // reportUpdates is an array of
  // { reportId: '', status: '' }
  const reportUpdates = req.body.reportUpdates;
  let error;
  if (!reportUpdates) {
    error = {
      status: 'ERROR',
      statusCode: 2,
      httpCode: 400,
      message: 'Missing Parameter: Report Updates'
    };
  } else if (!Array.isArray(reportUpdates) || reportUpdates.length < 1) {
    error = {
      status: 'ERROR',
      statusCode: 3,
      httpCode: 400,
      message: 'Invalid Parameter: Report Updates'
    };
  } else {
    error = null;
  }

  if (error) {
    req.logger.warn(error, 'POST /api/v1/reports/mass-update-status');
    return res.status(error.httpCode).send(error);
  }
  next();
}

function checkReportsToUpdate (req, res, next) {
  const reportUpdates = req.body.reportUpdates;
  const status = req.body.status;
  const note = req.$scope.note;
  const notValidReports = reportUpdates.reduce((acu, cv, index) => {
    if ((!cv.reportId) && !acu) {
      return { error: true, index: index };
    }
  }, null);

  if (notValidReports) {
    const error = {
      status: 'ERROR',
      statusCode: 3,
      httpCode: 400,
      message: 'Invalid Parameter: Report Updates - postion ' + notValidReports.index
    };
    return res.status(error.httpCode).send(error);
  }
  return Promise.map(reportUpdates, reportUpdate => internals.checkReportToUpdate({ reportId: reportUpdate.reportId, status, _note: note._id}))
    .then(results => {
      req.$scope.checkedReports = results;
      next();
    })
    .catch(err => {
      req.logger.error(err, 'POST /api/v1/reports/mass-update-status');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function logic (req, res, next) {
  const checkedReports = req.$scope.checkedReports;
  const validReportsToUpdate = checkedReports.reduce((acu, cv) => {
    if (cv.update) {
      return acu.concat(cv);
    }
    else acu;
  }, []);
  return Promise.map(validReportsToUpdate, internals.massUpdateStatus)
    .then(results => {
      req.$scope.updatedReports = results;
      next();
    })
    .catch(err => {
      req.logger.error(err, 'POST /api/v1/reports/mass-update-status');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function respond (req, res) {
  const updatedReports = req.$scope.updatedReports;
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201,
    result: updatedReports
  };
  req.logger.info(response, 'POST /api/v1/reports/mass-update-status');
  res.status(response.httpCode).send(response);
}

module.exports = {
  validateParams,
  checkReportsToUpdate,
  logic,
  respond
};

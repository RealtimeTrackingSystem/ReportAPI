const lib = require('../../lib');
const mailtemplates = require('../../assets/mailtemplates');

function validateBody (req, res, next) {
  const schema = {
    status: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Status'
    },
    note: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Note'
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

function checkReport (req, res, next) {
  const reportId = req.params.reportId;
  return req.DB.Report.findOne({ _id: reportId })
    .populate('_reporter')
    .populate('_host')
    .then(function (report) {
      if (!report) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Parameter: Report ID - Not Existing'
        };
        req.logger.warn(error, 'PUT /api/reports/status/:reportId');
        return res.status(error.statusCode).send(error);
      }
      req.$scope.reporter = report._reporter;
      console.log(report);
      req.$scope.host = report._host;
      req.$scope.report = report;
      next();
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

function addNote (req, res, next) {
  const reportId = req.params.reportId;
  const note = req.body.note;
  return req.DB.Note.add(reportId, note)
    .then((newNote) => {
      req.$scope.note = newNote;
      next();
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
  const note = req.$scope.note;
  return req.DB.Report.updateStatus(reportId, status, note._id)
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

function sendEmail (req, res, next) {
  const { reporter, host, report } = req.$scope;
  const reporterNotif = mailtemplates.reporterReportUpdate(report, reporter);
  const hostNotif = mailtemplates.hostReportUpdate(report, host);
  const mails = [
    { receiver: reporter.email, sender: 'report-api-team@noreply', subject: 'Report: ' + report.title, htmlMessage: reporterNotif },
    { receiver: host.email, sender: 'report-api-team@noreply', subject: 'Report: ' + report.title, htmlMessage: hostNotif }
  ];
  return req.mailer.bulkSimpleMail(mails)
    .then(function (results) {
      req.$scope.sentMails = results;
      req.logger.info(results, 'PUT /api/reports/status/:reportId');
      next();
    })
    .catch(function (error) {
      req.logger.error(error, 'PUT /api/reports/status/:reportId');
      next();
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
  checkReport,
  validateStatus,
  addNote,
  logic,
  sendEmail,
  respond
};

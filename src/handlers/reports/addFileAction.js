const lib = require('../../lib');
const db = require('mongoose');
const Transaction = require('mongoose-transactions');
 
const internals = {};

internals.catchError = (err, req, res) => {
  req.logger.error(err, 'POST /api/reports/fileActions');
  res.status(500).send({
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  });
};

function validateBody (req, res, next) {
  const schema = {
    reportId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Report Id'
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
    req.logger.warn('POST /api/reports/fileActions', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}


async function logic (req, res, next) {
  const { reportId, note } = req.body;
  const transaction = new Transaction();
  const fileAM = 'FileAction';
  const reportM = 'Report';
  try {
    const fileActionId = transaction.insert(fileAM, {
      note
    });

    const reportUpdateId = transaction.update(reportM, reportId, {
      _fileAction: fileActionId
    });

    await transaction.run();
    next();
  } catch (e) {
    await transaction.rollback();
    transaction.clean();
    internals.catchError(e, req, res);
  }
  
}

function respond (req, res) {
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  };
  req.logger.info(response, 'POST /api/reports/mediationNotes');
  res.status(response.httpCode).send(response);
}


module.exports = {
  validateBody,
  logic,
  respond
};

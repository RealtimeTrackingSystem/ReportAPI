const lib = require('../../lib');
const db = require('mongoose');
const Transaction = require('mongoose-transactions');
 
const internals = {};

internals.catchError = (err, req, res) => {
  // req.logger.error(err, 'POST /api/reports/mediationNotes');
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
    },
    reporterId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Reporter Id'
    },
    media: {
      optional: true
    }
  };
  req.checkBody(schema);
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    // req.logger.warn('POST /api/reports/mediationNotes', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}


async function logic (req, res, next) {
  const { reportId, note, reporterId, media } = req.body;
  const transaction = new Transaction();
  const mediaM = 'Attachment';
  const medationNM = 'MediationNote';
  const reportM = 'Report';
  try {

    const mediaId = transaction.insert(mediaM, {
      platform: media.platform,
      metaData: media.metaData
    });

    const mediationNoteId = transaction.insert(medationNM, {
      note: note,
      _reporter: reporterId,
      _media: mediaId,
      _report: reportId
    });

    const updatedReportId = transaction.update(reportM, reportId, {
      $addToSet: { mediationNotes: mediationNoteId }
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
  // req.logger.info(response, 'POST /api/reports/mediationNotes');
  res.status(response.httpCode).send(response);
}

module.exports = {
  validateBody,
  logic,
  respond
};

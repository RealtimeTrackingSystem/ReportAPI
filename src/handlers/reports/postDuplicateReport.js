const lib = require('../../lib');
const db = require('mongoose');
const Transaction = require('mongoose-transactions');
 
const internals = {};

internals.catchError = (err, req, res) => {
  req.logger.error(err, 'POST /api/reports/duplicates');
  res.status(500).send({
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  });
};

function validateBody (req, res, next) {
  const schema = {
    parentDuplicate: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Parent Duplicate Report'
    },
    duplicate: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Duplicate Report'
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn(errorObject, 'POST /api/reports/duplicates');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }

}

function validateReportIds (req, res, next) {
  const { duplicate, parentDuplicate } = req.body;
  let error;
  if (!lib.customValidators.isObjectId(duplicate)) {
    error = {
      status: 'ERROR',
      statusCode: 3,
      httpCode: 400,
      message: 'Invalid Parameter: Duplicate Report -> Invalid ID'
    };
  }

  if (!lib.customValidators.isObjectId(parentDuplicate)) {
    error = {
      status: 'ERROR',
      statusCode: 3,
      httpCode: 400,
      message: 'Invalid Parameter: Parent Duplicate Report -> Invalid ID'
    };
  }

  if (error) {
    req.logger.warn(error, 'POST /api/reports/duplicates');
    return res.status(error.httpCode).send(error);
  }

  next();
}

function validateParentDuplicate (req, res, next) {
  const parentDuplicate = req.body.parentDuplicate;
  return req.DB.Report.findOne({
    _id: parentDuplicate
  })
    .then(report => {
      if (!report || report.duplicateParent) {
        const error = {
          status: 'ERROR',
          statusCode: 3,
          httpCode: 400,
          message: 'Invalid Parameter: Parent Duplicate Report'
        };
        req.logger.warn(error, 'POST /api/reports/duplicates');
        return res.status(error.httpCode).send(error);
      }
      next();
    })
    .catch(err => internals.catchError(err, req, res));
}

function validateDuplicate (req, res, next) {
  const duplicate = req.body.duplicate;
  return req.DB.Report.findOne({
    _id: duplicate
  })
    .then(report => {
      if (!report || report.duplicates.length > 0) {
        const error = {
          status: 'ERROR',
          statusCode: 3,
          httpCode: 400,
          message: 'Invalid Parameter: Duplicate Report'
        };
        req.logger.warn(error, 'POST /api/reports/duplicates');
        return res.status(error.httpCode).send(error);
      }
      next();
    })
    .catch(err => internals.catchError(err, req, res));
}

function logic1 (req, res, next) {
  const { duplicate, parentDuplicate } = req.body;
  let session;
  return db.startSession()
    .then(_session => {
      session = _session;
      session.startTransaction();
      return req.DB.Report.findOneAndUpdate({
        _id: duplicate
      }, {
        duplicateParent: parentDuplicate,
        isDuplicate: true
      }, {
        session: session
      });
    })
    .then(report => {
      req.$scope.duplicateReport = report;
      return req.DB.Report.findOneAndUpdate({
        _id: parentDuplicate
      }, {
        $push: { duplicates: duplicate }
      }, {
        session: session
      });
    })
    .then(report => {
      req.$scope.duplicateParent = report;
      next();
    })
    .catch(err => {
      if (session) {
        session.abortTransaction();
      }
      internals.catchError(err, req, res);
    });
}

async function logic (req, res, next) {
  const { duplicate, parentDuplicate } = req.body;
  const transaction = new Transaction();
  const report = 'Report';

  try {
    const duplicateReport = await transaction.update(report, duplicate, {
      duplicateParent: parentDuplicate,
      isDuplicate: true
    });

    const duplicateParent = await transaction.update(report, parentDuplicate, {
      $addToSet: { duplicates: duplicate }
    });

    await transaction.run();
    next();
  }
  catch (e) {
    await transaction.rollback();
    transaction.clean();
    internals.internals(e, req, res);
  }
}

function respond (req, res) {
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  };
  req.logger.info(response, 'POST /api/reports/duplicates');
  res.status(response.httpCode).send(response);
}

module.exports = {
  validateBody,
  validateReportIds,
  validateDuplicate,
  validateParentDuplicate,
  logic,
  respond
};

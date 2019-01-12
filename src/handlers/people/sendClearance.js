const lib = require('../../lib');
const db = require('mongoose');
const Transaction = require('mongoose-transactions');
 
const internals = {};

internals.catchError = (err, req, res) => {
  req.logger.error(err, 'POST /api/people/clearances');
  res.status(500).send({
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  });
};

function validateBody (req, res, next) {
  const schema = {
    personId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Person Id'
    },
    clearanceNotes: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Clearance Notes'
    },
    reporterId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Reporter Id'
    },
    reporterMetaData: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Reporter Information'
    }
  };
  req.checkBody(schema);
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn('POST /api/people/clearances', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function checkPersonId (req, res, next) {
  return req.DB.Person.findOne({
    _id: req.body.personId
  })
    .then(person => {
      if (!person) {
        return res.status(400).send({
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Parameter: Person Id -> Cannot be found'
        });
      }
      next();
    })
    .catch(err => internals.catchError(err, req, res));
}

async function logic (req, res, next) {
  const transaction = new Transaction();
  const { personId, clearanceNotes, reporterId, reporterMetaData } = req.body;
  const personM = 'Person';
  const clearanceM = 'Clearance';
  try {
    const clearanceId = transaction.insert(clearanceM, {
      clearanceNotes,
      _reporter: reporterId,
      reporterMetaData
    });
    const personUpdateId = transaction.update(personM, personId, {
      _clearance: clearanceId
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
  req.logger.info(response, 'POST /api/people/clearances');
  res.status(response.httpCode).send(response);
}

module.exports = {
  validateBody,
  checkPersonId,
  logic,
  respond
};

const lib = require('../../lib');

const internals = {};

internals.catchError = (err, req, res) => {
  req.logger.error(err, 'POST /api/reports/summons');
  res.status(500).send({
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  });
};

function validateBody (req, res, next) {
  const schema = {
    compliance: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Compliance'
    },
    complianceNotes: {
      optional: true
    }
  };
  req.checkBody(schema);
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn('POST /api/people/summons', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}


function checkSummon (req, res, next) {
  const summonId = req.params.summonId;
  return req.DB.Summon.findById(summonId)
    .populate('_person')
    .then((summon) => {
      if (!summon || summon.compliance !== 'NEW') {
        return res.status(400).send({
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Parameter: Summon Id -> ' + !summon ? 'Cant find summon' : 'Summon already updated'
        });
      }
      req.$scope.summon = summon;
      next();
    })
    .catch(e => internals.catchError(e, req, res));
}

function logic (req, res) {
  const summonId = req.params.summonId;
  const { compliance, complianceNotes } = req.body;
  return req.DB.Summon.findOneAndUpdate({
    _id: summonId
  }, {
    compliance: compliance,
    complianceNotes: complianceNotes
  })
    .then((summon) => {
      res.status(201).send({
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 201
      });
    })
    .catch(e => internals.catchError(e, req, res));
}

module.exports = {
  validateBody,
  checkSummon,
  logic
};

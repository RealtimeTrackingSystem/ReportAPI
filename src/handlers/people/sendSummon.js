const lib = require('../../lib');
const db = require('mongoose');
const Transaction = require('mongoose-transactions');
 
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
    personId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Person Id'
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

async function logic (req, res, next) {
  const personId = req.body.personId;
  const transaction = new Transaction();
  const personM = 'Person';
  const summonM = 'Summon';

  try {
    const person = await req.DB.Person.findOne({ _id: personId }).populate('summons');
    const summons = person.summons;
    const currentCount = summons.length;
    const newSummonId = transaction.insert(summonM, {
      _person: person._id,
      count: currentCount + 1
    });
    if (currentCount > 2) {
      return res.status(400).send({
        status: 'ERROR',
        statusCode: 3,
        httpCode: 400,
        message: 'Cannot add more than 3 Summons'
      });
      await transaction.rollback();
    }
    const updatePerson = transaction.update(personM, personId, {
      $addToSet: { summons: newSummonId }
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
  req.logger.info(response, 'POST /api/people/summons');
  res.status(response.httpCode).send(response);
}

module.exports = {
  validateBody,
  logic,
  respond
};

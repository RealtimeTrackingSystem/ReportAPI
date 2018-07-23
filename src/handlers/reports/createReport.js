const lib = require('../../lib');
function validateBody (req, res, next) {
  const schema = {
    title: {
      isLength: {
        errorMessage: 'Missing Field: Title',
        options: { min: 1 }
      }
    },
    description: {
      isLength: {
        errorMessage: 'Missing Field: Description',
        options: { min: 1 }
      }
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }

}

function logic (req, res, next) {
  return next();
}

function respond (req, res) {
  res.status(201).send({
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201,
    message: 'Successfully created report'
  });
}

module.exports = {
  validateBody,
  logic,
  respond
};

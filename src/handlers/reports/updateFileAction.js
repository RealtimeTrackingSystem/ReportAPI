const lib = require('../../lib');

const internals = {};

internals.catchError = (err, req, res) => {
  req.logger.error(err, 'PUT /api/reports/fileaction');
  res.status(500).send({
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  });
};

function validateBody (req, res, next) {
  const schema = {
    note: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Note'
    }
  };
  req.checkBody(schema);
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn('PUT /api/reports/fileaction', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function logic (req, res, next) {
  const fileActionId = req.params.fileActionId;
  const note = req.body.note;
  return req.DB.FileAction.findOneAndUpdate({
    _id: fileActionId
  }, {
    note: note
  })
    .then(fileAction => {
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
  logic
};

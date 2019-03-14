const lib = require('../../lib');

function validateParams (req, res, next) {
  const schema = {
    file: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: File'
    }
  };

  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    // req.logger.warn(errorObject, 'PUT /api/reporters/profilepic/:reporterId');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function validateReporter (req, res, next) {
  const reporterId = req.params.reporterId;
  if (!lib.customValidators.isObjectId(reporterId)) {
    const error = {
      status: 'ERROR',
      statusCode: 1,
      httpCode: 400,
      message: 'Invalid Parameter: Reporter ID'
    };
    // req.logger.warn(error, 'PUT /api/reporters/profilepic/:reporterId');
    return res.status(error.httpCode).send(error);
  }
  return req.DB.Reporter.findById(reporterId)
    .then((reporter) => {
      if (!reporter) {
        const error = {
          status: 'ERROR',
          statusCode: 3,
          httpCode: 400,
          message: 'Invalid Parameter: Reporter ID'
        };
        // req.logger.warn(error, 'PUT /api/reporters/profilepic/:reporterId');
        return res.status(error.httpCode).send(error);
      }
      return next();
    })
    .catch(err => {
      const error = {
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      };
      // req.logger.warn(err, 'PUT /api/reporters/profilepic/:reporterId');
      res.status(error.httpCode).send(error);
    });
}


function logic (req, res, next) {
  const reporterId = req.params.reporterId;
  const file = req.body.file;
  console.log(file);
  return req.DB.Picture.add({
    metaData: file.metaData,
    platform: 'cloudinary'
  })
    .then((picture) => {
      return req.DB.Reporter.findByIdAndUpdate(reporterId, {
        profilePicture: picture._id
      });
    })
    .then(() => {
      next();
    })
    .catch(err => {
      const error = {
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      };
      // req.logger.warn(err, 'PUT /api/reporters/profilepic/:reporterId');
      res.status(error.httpCode).send(error);
    });
}

function respond (req, res) {
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  };
  // req.logger.info(response, 'PUT /api/reporters/profilepic/:reporterId');
  res.status(response.httpCode).send(response);
}

module.exports = {
  validateParams,
  validateReporter,
  logic,
  respond
};

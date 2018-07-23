const STATUS_SCODES = {
  MISSING_PARAM: 1,
  INVALID_PARAM: 2
};


function validationError (validationErrors) {
  const status = 'ERROR';
  const message = validationErrors[0].msg;
  let statusCode;
  const errorMessage = validationErrors[0].msg.split(' ')[0].toUpperCase();
  if (errorMessage === 'MISSING') {
    statusCode = STATUS_SCODES.MISSING_PARAM;
  } else if (errorMessage === 'DUPLICATE') {
    statusCode = STATUS_SCODES.INVALID_PARAM;
  } else {
    statusCode = STATUS_SCODES.INVALID_PARAM;
  }
  return {
    status,
    statusCode,
    httpCode: 400,
    message
  };
}

function internalServerError (errorMessage) {
  return {
    status: 'ERROR',
    statusCode: 5,
    httpCode: 500,
    message: errorMessage
  };
}

module.exports = {
  validationError,
  internalServerError
};

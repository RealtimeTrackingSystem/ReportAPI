
const internals = {};
internals.catch = function (err, req, res) {
  const error = {
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  };
  // req.logger.error(err, 'PUT /api/hosts/approval');
  res.status(error.httpCode).send(error);
};
function checkHost (req, res, next) {
  const hostId = req.params.hostId;
  return req.DB.Host.findById(hostId)
    .populate('_client')
    .then(host => {
      if (!host) {
        const error = {
          status: 'ERROR',
          statusCode: 3,
          httpCode: 400,
          message: 'Invalid Parameter: Host ID -> Host Not listed'
        };
        // req.logger.warn(error, 'PUT /api/hosts/approval');
        return res.status(error.httpCode).send(error);
      }
      req.$scope.host = host;
      next();
    })
    .catch(err => internals.catch(err, req, res));
}

function checkClient (req, res, next) {
  const client = req.$scope.clientCredentials;
  const host = req.$scope.host;

  if (host._client._id.toString() != client._id.toString()) {
    const error = {
      status: 'ERROR',
      statusCode: 3,
      httpCode: 400,
      message: 'Invalid Parameter: Host ID -> Invalid Client'
    };
    // req.logger.warn(error, 'PUT /api/hosts/approval');
    return res.status(error.httpCode).send(error);
  }
  next();
}

function logic (req, res, next) {
  const host = req.$scope.host;
  req.DB.Host.approve(host._id)
    .then((updatedHost) => {
      // req.logger.info(updatedHost, 'PUT /api/hosts/approval');
      next();
    })
    .catch(err => internals.catch(err, req, res));
}

function respond (req, res) {
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201,
    host: req.$scope.host
  };
  // req.logger.info(response, 'PUT /api/hosts/approval');
  res.status(response.httpCode).send(response);
}

module.exports = {
  checkClient,
  checkHost,
  logic,
  respond
};

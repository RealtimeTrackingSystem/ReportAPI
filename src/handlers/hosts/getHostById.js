const lib = require('../../lib');

function validateParams (req, res, next) {
  const hostId = req.params.hostId;
  const isValidated = lib.customValidators.isObjectId(hostId);
  if (!isValidated) {
    const error = {
      status: 'ERROR',
      statusCode: 2,
      httpCode: 400,
      message: 'Invalid Parameters: Host ID'
    };
    req.logger.warn(error, 'GET /api/hosts/:hostId');
    return res.status(error.httpCode).send(error);
  }
  next();
}

function queryBuilder (req, res, next) {
  const hostId = req.params.hostId;
  const HostQuery = req.DB.Host.findById(hostId);
  req.$scope.HostQuery = HostQuery;
  next();
}

function logic (req, res, next) {
  return req.$scope.HostQuery
    .then(function (host) {
      req.$scope.host = host;
      next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internale Server Error');
      req.logger.error(error, 'GET /api/hosts/hostId');
      res.status(500).send(err);
    });
}

function respond (req, res) {
  const host = req.$scope.host;
  const result = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    host: host
  };
  req.logger.info(result, 'GET /api/hosts/:hostId');
  res.status(200).send(result);
}

module.exports = {
  validateParams,
  queryBuilder,
  logic,
  respond
};

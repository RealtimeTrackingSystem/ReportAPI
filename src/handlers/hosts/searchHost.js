const internals = {};
internals.serverError = function (err, req, res) {
  // req.logger.error(err, 'GET /api/hosts/search/:searchString');
  res.status(500).send({
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  });
};

function validateParams (req, res, next) {
  const searchString = req.params.searchString;
  if (!searchString) {
    const error = {
      status: 'ERROR',
      statusCode: 2,
      httpCode: 400,
      message: 'Missing Parameters: Search String'
    };
    // req.logger.warn(error, 'GET /api/hosts/search/:searchString');
    return res.status(error.httpCode).send(error);
  }
  next();
}

function logic (req, res, next) {
  const searchString = req.params.searchString;
  return req.DB.Host.search(searchString)
    .then(function (hosts) {
      req.$scope.hosts = hosts;
      next();
    })
    .catch(err => internals.serverError(err, req, res));
    
}

function respond (req, res) {
  const hosts = req.$scope.hosts;
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    hosts: hosts
  };
  res.status(response.httpCode).send(response);
}

module.exports = {
  validateParams,
  logic,
  respond
};


const lib = require('../../lib');
function authenticate (req, res, next) {
  const err = {
    status: 'ERROR',
    statusCode: 3,
    httpCode: 401,
    message: 'Unauthorized'
  };
  if (!req.headers['api-key']) {
    req.logger.warn(err, 'Client-Authentication');
    return res.status(401).send(err);
  }
  return req.DB.Client.findOne({
    apiKey: req.headers['api-key']
  })
    .then(function (client) {
      if (!client) {
        req.logger.warn(err, 'Client-Authentication');
        return res.status(401).send(err);
      }
      req.$scope.clientCredentials = client;
      return next();
    })
    .catch(function (err) {
      req.logger.error(err, 'Client-Authentication');
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      return res.status(500).send(error);
    });
}

module.exports = {
  authenticate
};


const lib = require('../../lib');
function authenticate (req, res, next) {
  req.DB.Client.findOne({
    apiKey: req.headers['api-key']
  })
    .then(function (client) {
      if (!client) {
        const err = {
          status: 'ERROR',
          statusCode: 3,
          httpCode: 401,
          message: 'Unauthorized'
        };
        req.logger.warn('Client-Authentication', err);
        return res.status(401).send(err);
      }
      req.$scope.clientCredentials = client;
      return next();
    })
    .catch(function (err) {
      req.logger.error('Client-Authentication', err);
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      return res.status(500).send(error);
    });
}

module.exports = {
  authenticate
};

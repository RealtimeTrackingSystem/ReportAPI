const lib = require('../../lib');

function generateWhereClause (req, res, next) {
  const where = {};
  console.log(req.query);
  if (req.query.isDuplicate == 'false') {
    where.isDuplicate = false;
  } else {
    where.isDuplicate = true;
  }
  req.$scope.where = where;
  next();
}

function logic (req, res, next) {
  const where = req.$scope.where;
  return req.DB.Report.find(where)
    .populate('notes')
    .populate('_reporter')
    .populate('_host')
    .populate('_category')
    .populate('duplicateParent')
    .populate('duplicates')
    .populate('people')
    .populate('properties')
    .populate('medias')
    .then((reports) => {
      req.$scope.reports = reports;
      next();
    })
    .catch(err => {
      const error = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error(err, 'GET /api/reports/duplicates');
      res.status(error.httpCode).send(error);
    });
}

function respond (req, res) {
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    reports: req.$scope.reports || []
  };
  req.logger.info(response, 'GET /api/reports/duplicates');
  res.status(response.httpCode).send(response);
}

module.exports = {
  generateWhereClause,
  logic,
  respond
};

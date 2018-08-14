const lib = require('../../lib');

function validateQuery (req, res, next) {
  const schema = {
    limit: {
      optional: true,
      isInt: {
        errorMessage: 'Invalid Parameter: Limit'
      }
    },
    page: {
      optional: true,
      isInt: {
        errorMessage: 'Invalid Parameter: Page'
      }
    }
  };
  req.checkQuery(schema);
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn('GET /api/reports', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function addTagsToWhereClause (req, res, next) {
  const tags = req.query.tags ? req.query.tags.split(',') : [];
  const where = req.$scope.whereClause || {};
  if (!req.query.tags) {
    return next();
  }
  where.tags = {
    $elemMatch: {
      $in: tags
    }
  };
  req.$scope.whereClause = where;
  next();
}

function logic (req, res) {
  const limit = parseInt(req.query.limit) || 30;
  const page = parseInt(req.query.page) || 0;
  const where = req.$scope.whereClause || {};
  return req.DB.Report.findPaginated(where, page, limit)
    .then(function (reports) {
      res.status(200).send({
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 200,
        reports: reports
      });
    });
}

module.exports = {
  validateQuery,
  addTagsToWhereClause,
  logic
};

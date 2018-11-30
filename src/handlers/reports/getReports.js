const lib = require('../../lib');

const ALLOWED_RESOURCES = ['reporter', 'host', 'people', 'properties', 'medias'];

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

function addOtherOptionsOnWhereClause (req, res, next) {
  const where = req.$scope.whereClause || {};
  if (req.query.reporter) {
    where._reporter = req.query.reporter;
  }

  if (req.query.host) {
    where._host = req.query.host;
  }

  if (req.query.isDuplicate != null ) {
    where.isDuplicate = req.query.isDuplicate;
  }


  req.$scope.whereClause = where;
  next();
}

function getReports (req, res, next) {
  const limit = parseInt(req.query.limit) || null;
  const page = parseInt(req.query.page) || 0;
  const where = req.$scope.whereClause || {};
  const resources
    = req.query.resources
      ? req.query.resources
        .split(',')
        .reduce(function (p, c) {
          if (ALLOWED_RESOURCES.indexOf(c) > -1) {
            return p.concat([c]);
          }
          return p;
        }, [])
      : [];
  return req.DB.Report.findPaginated(where, page, limit, resources)
    .then(function (reports) {
      req.$scope.reports = reports;
      next();
    })
    .catch(function (err) {
      req.logger.error(err, 'GET /api/reports');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function getReportCount (req, res, next) {
  const where = req.$scope.whereClause || {};
  return req.DB.Report.countDocuments(where)
    .then(function (count) {
      req.$scope.reportCount = count;
      next();
    })
    .catch(function (err) {
      req.logger.error(err, 'GET /api/reports');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function respond (req, res) {
  const reports = req.$scope.reports;
  
  const result = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    reports: reports,
    count: req.$scope.reportCount
  };
  req.logger.info(result, 'GET /api/reports');
  res.status(result.httpCode).send(result);
}

module.exports = {
  validateQuery,
  addTagsToWhereClause,
  addOtherOptionsOnWhereClause,
  getReports,
  getReportCount,
  respond
};

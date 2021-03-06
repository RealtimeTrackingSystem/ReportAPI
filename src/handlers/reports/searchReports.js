const lib = require('../../lib');
const ALLOWED_RESOURCES = ['reporter', 'host', 'people', 'properties', 'medias'];

const internals = {};

internals.serverError = function (err, req, res) {
  // req.logger.error(err, 'GET /api/reports/search/:searchString');
  res.status(500).send({
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  });
};

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
    // req.logger.warn('GET /api/reports', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function validateParams (req, res, next) {
  const searchString = req.params.searchString;
  if (!searchString) {
    const error = {
      status: 'ERROR',
      statusCode: 2,
      httpCode: 400,
      message: 'Missing Parameters: Search String'
    };
    // req.logger.warn(error, 'GET /api/reports/search/:searchString');
    return res.status(error.httpCode).send(error);
  }
  next();
}

function getReports (req, res, next) {
  const limit = parseInt(req.query.limit) || null;
  const page = parseInt(req.query.page) || 0;
  const searchString = req.params.searchString;
  const options = {};
  if (req.query.isDuplicate != null ) {
    options.isDuplicate = req.query.isDuplicate;
  }
  if (req.query.hostId) {
    options.host = req.query.hostId;
  }
  return req.DB.Report.searchPaginated(searchString, page, limit, options)
    .then(function (reports) {
      req.$scope.reports = reports;
      next();
    })
    .catch(function (err) {
      // req.logger.error(err, 'GET /api/reports/search/:searchString');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function getReportCount (req, res, next) {
  const searchString = req.params.searchString;
  const query = {
    $and: [
      {
        $or: [
          { title: { $regex: searchString, $options: 'i' } },
          { description: { $regex: searchString, $options: 'i' } },
          { location: { $regex: searchString, $options: 'i' } },
          { urgency: { $regex: searchString.toUpperCase(), $options: 'i' } },
          { 'category.name': { $regex: searchString, $options: 'i' } },
          { 'category.description': { $regex: searchString, $options: 'i' } },
          { status: { $regex: searchString.toUpperCase(), $options: 'i' } },
          { tags: {
            $elemMatch: {
              $in: [searchString]
            }
          }}
        ]
      }
    ]
  };
  if (req.query.isDuplicate != null ) {
    query.$and.push({
      isDuplicate: req.query.isDuplicate
    });
  }
  if (req.query.hostId) {
    query.$and.push({
      _host: req.query.hostId
    });
  }
  return req.DB.Report.countDocuments(query)
    .then(function (count) {
      req.$scope.reportCount = count;
      next();
    })
    .catch(function (err) {
      // req.logger.error(err, 'GET /api/reports/search/:searchString');
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
  // req.logger.info(result, 'GET /api/reports/search/:searchString');
  res.status(result.httpCode).send(result);
}

module.exports = {
  validateParams,
  validateQuery,
  getReports,
  getReportCount,
  respond
};

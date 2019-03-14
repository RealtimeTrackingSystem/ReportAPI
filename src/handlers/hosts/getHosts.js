const lib = require('../../lib');

const internals = {};
internals.serverError = function (err, req, res) {
  // req.logger.error(err, 'GET /api/hosts');
  res.status(500).send({
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  });
};

internals.parseFilter = function (filterString) {
  // filter syntax = resource:value:toInclude | resource:value:toInclude
  return filterString
    .split('|')
    .reduce((p, c) => {
      const data = c.split(':');
      p[data[0]] = {
        value: data[1].split(','),
        toInclude: data[2] ? data[2] === 'true' : false
      };
      return p;
    }, {});
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
    },
    filter: {
      optional: true
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

function processFilter (req, res, next) {
  const filterString = req.query.filter;
  if (!filterString) {
    return next();
  }
  const filterObject = internals.parseFilter(filterString);
  const where = {
    $and: []
  };
  try {
    if (filterObject._id) {
      const filter = !filterObject._id.toInclude
        ? { _id: {$exists: true, $nin: filterObject._id.value} }
        : { _id: {$exists: true, $in: filterObject._id.value} };
      where.$and.push(filter);
    }
    req.$scope.whereClause = where;
    next();
  }
  catch (e) {
    internals.serverError(e, req, res);
  }
}

function setOtherOptions (req, res, next) {
  const where = req.$scope.whereClause || {};
  if (req.query.isApproved != null) {
    where.isApproved = req.query.isApproved;
  }


  req.$scope.whereClause = where;
  next();
}

function getHostCount (req, res, next) {
  const where = req.$scope.whereClause || {};
  return req.DB.Host.countDocuments(where)
    .then(function (count) {
      req.$scope.hostCount = count;
      next();
    })
    .catch(err => internals.serverError(err, req, res));
}

function logic (req, res, next) {
  const limit = parseInt(req.query.limit) || 30;
  const page = parseInt(req.query.page) || 0;
  const where = req.$scope.whereClause || {};
  return req.DB.Host.findPaginated(where, page, limit)
    .then(function (hosts) {
      req.$scope.hosts = hosts;
      next();
    })
    .catch(err => internals.serverError(err, req, res));
}

function respond (req, res) {
  const success = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    hosts: req.$scope.hosts,
    count: req.$scope.hostCount
  };
  // req.logger.info(success, 'GET /api/hosts');
  res.status(success.httpCode).send(success);
}

module.exports = {
  validateQuery,
  processFilter,
  setOtherOptions,
  getHostCount,
  logic,
  respond
};

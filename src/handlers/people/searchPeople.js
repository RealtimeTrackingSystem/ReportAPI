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
    },
    search: {
      optional: true
    },
    isCulprit: {
      optional: true
    }
  };
  req.checkQuery(schema);
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    // req.logger.warn('GET /api/people', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}


function getPeople (req, res) {
  const { search, limit, page, isCulprit } = req.query;
  return req.DB.Person.findPaginated(search, page, limit, { isCulprit })
    .then((result) => {
      const response = {
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 200,
        people: result.people,
        count: result.count
      };
      // req.logger.info(response, 'GET /api/people');
      res.status(response.httpCode).send(response);
    })
    .catch(function (err) {
      // req.logger.error(err, 'GET /api/people');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

module.exports = {
  validateQuery,
  getPeople
};

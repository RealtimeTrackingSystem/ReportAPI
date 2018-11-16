const lib = require('../../lib');

function validateBody (req, res, next) {
  const schema = {
    fname: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: First Name',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: First Name'
      }
    },
    lname: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Last Name',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Last Name'
      }
    },
    email: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Email',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Email'
      }
    },
    gender: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Gender',
      isLength: {
        options: { min: 1, max: 50 },
        errorMessage: 'Invalid Parameter Length: Gender'
      }
    },
    alias: {
      optional: true,
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Alias'
      }
    },
    age: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Age',
      isInt: {
        options: { min: 16 },
        errorMessage: 'Invalid Parameter: Age - Must be 16 +'
      },
      toInt: true
    },
    street: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Street',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Street'
      }
    },
    barangay: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Barangay',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Barangay'
      }
    },
    city: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: City',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: City'
      }
    },
    region: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Region',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Region'
      }
    },
    country: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Country',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Country'
      }
    },
    zip: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Zip',
      isLength: {
        options: { min: 2, max: 50 },
        errorMessage: 'Invalid Parameter Length: Zip'
      }
    }
  };

  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn(errorObject, 'POST /api/reporters');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function logic (req, res, next) {
  const reporter = req.body;
  const reporterData = {
    fname: reporter.fname,
    lname: reporter.lname,
    email: reporter.email,
    age: reporter.age,
    gender: reporter.gender,
    alias: reporter.alias,
    street: reporter.street,
    barangay: reporter.barangay,
    city: reporter.city,
    region: reporter.region,
    country: reporter.country,
    zip: reporter.zip
  };
  return req.DB.Reporter.add(reporterData)
    .then(function (r) {
      req.$scope.reporter = r;
      next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internale Server Error');
      req.logger.error(error, 'POST /api/reporters');
      res.status(500).send(err);
    });
}

function respond (req, res) {
  const reporter = req.$scope.reporter;
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201,
    reporter: reporter
  };
  req.logger.info(response, 'POST /api/reporters');
  res.status(201).send(response);
}

module.exports = {
  validateBody,
  logic,
  respond
};

const lib = require('../../lib');

function validateBody (req, res, next) {
  const schema = {
    name: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Name'
    },
    email: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Email',
      isEmail: {
        errorMessage: 'Invalid Parameter: Email'
      }
    },
    location: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Location',
      isLength: {
        options: { min: 4, max: 255 },
        errorMessage: 'Invalid Parameter Length: Location'
      }
    },
    description: {
      optional: true,
      isLength: {
        options: { min: 4, max: 255 },
        errorMessage: 'Invalid Parameter Length: Description'
      }
    },
    hostNature: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Host Nature'
    },
    defaultTags: {
      optional: true,
      isArray: {
        errorMessage: 'Invalid Parameter: Default Tags'
      }
    },
    long: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Longitude',
      isDecimal: {
        options: { min: 0 },
        errorMessage: 'Invalid Parameter: Longitude'
      }
    },
    lat: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Latitude',
      isDecimal: {
        options: { min: 0 },
        errorMessage: 'Invalid Parameter: Latitude'
      }
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
    req.logger.warn(errorObject, 'POST /api/hosts');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function checkDuplicates (req, res, next) {
  const { name, email } = req.body;
  return req.DB.Host.findOne()
    .or([
      { email: email },
      { name: name }
    ])
    .then(function (host) {
      if (host) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Resource: Host [ Email or Name ] Already Exists'
        };
        req.logger.warn(error, 'POST /api/hosts');
        return res.status(error.httpCode).send(error);
      }
      next();
    })
    .catch(function (err) {
      req.logger.error(err, 'POST /api/hosts');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function logic (req, res, next) {
  const host = {
    name: req.body.name,
    email: req.body.email,
    location: req.body.location,
    description: req.body.description,
    hostNature: req.body.hostNature,
    defaultTags: req.body.defaultTags || [],
    long: req.body.long,
    lat: req.body.lat,
    street: req.body.street,
    barangay: req.body.barangay,
    city: req.body.city,
    region: req.body.region,
    country: req.body.country,
    zip: req.body.zip
  };
  return req.DB.Host.add(host)
    .then(function (host) {
      req.$scope.host = host;
      next();
    })
    .catch(function (err) {
      req.logger.error(err, 'POST /api/hosts');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function respond (req, res) {
  const host = req.$scope.host;
  const response = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201,
    host: host
  };
  req.logger.info(response, 'POST /api/hosts');
  res.status(201).send(response);
}

module.exports = {
  validateBody,
  checkDuplicates,
  logic,
  respond
};

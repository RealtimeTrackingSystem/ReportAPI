const lib = require('../../lib');
const _ = require('lodash');
function validateBody (req, res, next) {
  const schema = {
    title: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Title',
      isLength: {
        options: { max: 20 },
        errorMessage: 'Invalid Parameter Length: Title'
      }
    },
    description: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Description',
      isLength: {
        options: { max: 255 },
        errorMessage: 'Invalid Parameter Length: Description'
      }
    },
    location: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Location',
      isLength: {
        options: { max: 255 },
        errorMessage: 'Invalid Parameter Length: Location'
      }
    },
    long: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Longitude',
      isInt: {
        options: { min: 0 },
        errorMessage: 'Invalid Parameter Length: Longitude'
      }
    },
    lat: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Latitude',
      isInt: {
        options: { min: 0 },
        errorMessage: 'Invalid Parameter Length: Latitude'
      }
    },
    people: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: People',
      isArray: {
        errorMessage: 'Invalid Parameter: People'
      }
    },
    properties: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Properties',
      isArray: {
        errorMessage: 'Invalid Parameter: Properties'
      }
    },
    medias: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Medias',
      isArray: {
        errorMessage: 'Invalid Parameter: Medias'
      }
    },
    tags: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Tags',
      isArray: {
        errorMessage: 'Invalid Parameter: Tags'
      }
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn('POST /api/reports', errorObject);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }

}

function addPeopleToScope (req, res, next) {
  if (req.body.people && req.body.people.length > 0) {
    req.$scope.people = req.body.people;
  }
  next();
}

function addPropertiesToScope (req, res, next) {
  if (req.body.properties && req.body.properties.length > 0) {
    req.$scope.people = req.body.properties;
  }
  next();
}

function addMediasToScope (req, res, next) {
  if (req.body.medias && req.body.medias.length > 0) {
    req.$scope.medias = req.body.medias;
  }
  next();
}

function addReportToScope (req, res, next) {
  const report = {
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    long: req.body.long,
    lat: req.body.lat,
    tags: req.body.tags
  };
  req.$scope.report = report;
  next();
}

function saveReportToDB (req, res, next) {
  const report = _.clone(req.$scope.report);
  return req.DB.Report.add(report)
    .then(function (newReport) {
      req.$scope.newReport = newReport;
      return next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internal Server Error');
      req.logger.error('POST /api/reports', error);
      res.status(500).send(err);
    });
}

function respond (req, res) {
  const success = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201,
    report: req.$scope.newReport._id
  };
  req.logger.info('POST /api/reports', success);
  res.status(201).send(success);
}

module.exports = {
  validateBody,
  addPropertiesToScope,
  addMediasToScope,
  addPeopleToScope,
  addReportToScope,
  saveReportToDB,
  respond
};

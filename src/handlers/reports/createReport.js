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
      optional: true,
      errorMessage: 'Missing Parameter: People',
      isArray: {
        errorMessage: 'Invalid Parameter: People'
      }
    },
    properties: {
      optional: true,
      errorMessage: 'Missing Parameter: Properties',
      isArray: {
        errorMessage: 'Invalid Parameter: Properties'
      }
    },
    medias: {
      optional: true,
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

function addReportToScope (req, res, next) {
  const report = {
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    long: req.body.long,
    lat: req.body.lat,
    tags: req.body.tags
  };
  req.$scope.preparedReport = req.DB.Report.prepare(report);
  next();
}

function addPeopleToScope (req, res, next) {
  if (req.body.people && req.body.people.length > 0) {
    req.$scope.people = req.body.people
      .map(function (person) {
        return {
          _report: req.$scope.preparedReport._id,
          fname: person.fname,
          lname: person.lname,
          alias: person.alias,
          isCulprit: person.isCulprit,
          isCasualty: person.isCasualty
        };
      });
  }
  next();
}

function savePeopleToDB (req, res, next) {
  if (!req.$scope.people) {
    return next();
  }
  return req.DB.Person.addMany(req.$scope.people)
    .then(function (addedPeople) {
      const peopleIds = addedPeople.map(function (addedPerson) {
        return addedPerson._id;
      });
      req.$scope.preparedReport.people = peopleIds;
      return next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internale Server Error');
      req.logger.error('POST /api/reports', error);
      res.status(500).send(err);
    });
}

function addPropertiesToScope (req, res, next) {
  if (req.body.properties && req.body.properties.length > 0) {
    req.$scope.properties = req.body.properties
      .map(function (property) {
        return {
          _report: req.$scope.preparedReport._id,
          type: property.type,
          owner: property.owner,
          description: property.description,
          estimatedCost: property.estimatedCost
        };
      });
  }
  next();
}

function savePropertiesToDB (req, res, next) {
  if (!req.$scope.properties) {
    return next();
  }
  return req.DB.Property.insertMany(req.$scope.properties)
    .then(function (addedProperty) {
      const properyIds = addedProperty.map(function (addedProp) {
        return addedProp._id;
      });
      req.$scope.preparedReport.properties = properyIds;
      return next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internale Server Error');
      req.logger.error('POST /api/reports', error);
      res.status(500).send(err);
    });
}

function addMediasToScope (req, res, next) {
  if (req.body.medias && req.body.medias.length > 0) {
    req.$scope.medias = req.body.medias
      .map(function (media) {
        return {
          _report: req.$scope.preparedReport._id,
          platform: media.platform,
          metaData: media.metaData
        };
      });
  }
  next();
}

function saveMediasToDB (req, res, next) {
  if (!req.$scope.medias) {
    return next();
  }
  return req.DB.Media.insertMany(req.$scope.medias)
    .then(function (addedMedias) {
      const mediaIds = addedMedias.map(function (addedMedia) {
        return addedMedia._id;
      });
      req.$scope.preparedReport.medias = mediaIds;
      return next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internale Server Error');
      req.logger.error('POST /api/reports', error);
      res.status(500).send(err);
    });
}

function saveReportToDB (req, res, next) {
  return req.$scope.preparedReport
    .save()
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

function saveReportToClientReport (req, res, next) {
  const _client = req.$scope.clientCredentials._id;
  const _report = req.$scope.preparedReport._id;
  return req.DB.ClientReport.add({_client, _report})
    .then(function () {
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
  savePropertiesToDB,
  addMediasToScope,
  saveMediasToDB,
  addPeopleToScope,
  savePeopleToDB,
  addReportToScope,
  saveReportToDB,
  saveReportToClientReport,
  respond
};

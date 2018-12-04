const lib = require('../../lib');
const mailtemplates = require('../../assets/mailtemplates');


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
      isNumber: {
        options: { min: 0 },
        errorMessage: 'Invalid Parameter Length: Longitude'
      }
    },
    lat: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Latitude',
      isNumber: {
        options: { min: 0 },
        errorMessage: 'Invalid Parameter Length: Latitude'
      }
    },
    hostId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Host ID',
      isLength: {
        options: { max: 255 },
        errorMessage: 'Invalid Parameter Length: Location'
      }
    },
    reporterId: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Reporter ID'
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
    },
    category: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Category'
    },
    urgency: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Urgency'
    }
  };
  req.checkBody(schema);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    req.logger.warn(errorObject, 'POST /api/reports');
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function checkCategory (req, res, next) {
  const category = req.body.category;
  let error;
  if (!category) {
    error = {
      status: 'ERROR',
      statusCode: 2,
      httpCode: 400,
      message: 'Missing Parameter: Category'
    };
  }
  
  if (!category.description) {
    error = {
      status: 'ERROR',
      statusCode: 3,
      httpCode: 400,
      message: 'Invalid Parameter: Category -> no description'
    };
  }

  if (!category.name) {
    error = {
      status: 'ERROR',
      statusCode: 3,
      httpCode: 400,
      message: 'Invalid Parameter: Category -> no name'
    };
  }

  if (error) {
    req.logger.warn(error, 'POST /api/reports');
    return res.status(error.httpCode).send(error);
  }
  next();
}

function checkDuplicate (req, res, next) {
  const {
    title, description, location, long, lat, urgency
  } = req.body;
  const query = {
    $and: [
      { title: title },
      { description: description},
      { location: location },
      { urgency: urgency },
      { long: long },
      { lat: lat }
    ]
  };
  return req.DB.Report.findOne(query)
    .then(function (report) {
      if (report) {
        const response = {
          status: 'SUCCESS',
          statusCode: 0,
          httpCode: 201,
          report: report._id
        };
        res.status(response.httpCode).send(response);
      } else {
        next();
      }
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internale Server Error');
      req.logger.error(error, 'POST /api/reports');
      res.status(500).send(err);
    });
}

function validateHost (req, res, next) {
  const hostId = req.body.hostId;
  if (!hostId) {
    return next();
  }
  const validId = lib.customValidators.isObjectId(hostId);
  const error = {
    status: 'ERROR',
    statusCode: 2,
    httpCode: 400,
    message: 'Invalid Parameter: Host ID'
  };
  if (!validId) {
    req.logger.warn(error, 'POST /api/reports');
    return res.status(error.httpCode).send(error);
  }
  return req.DB.Host.findById(hostId)
    .then(function (host) {
      if (!host) {
        req.logger.warn(error, 'POST /api/reports');
        return res.status(error.httpCode).send(error);
      }
      req.$scope.host = host;
      next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internale Server Error');
      req.logger.error(error, 'POST /api/reports');
      res.status(500).send(err);
    });
}

function validateReporter (req, res, next) {
  const reporterId = req.body.reporterId;
  const validId = lib.customValidators.isObjectId(reporterId);
  const error = {
    status: 'ERROR',
    statusCode: 2,
    httpCode: 400,
    message: 'Invalid Parameter: Reporter ID'
  };
  if (!validId) {
    req.logger.warn(error, 'POST /api/reports');
    return res.status(error.httpCode).send(error);
  }
  return req.DB.Reporter.findById(reporterId)
    .then(function (reporter) {
      if (!reporter) {
        req.logger.warn(error, 'POST /api/reports');
        return res.status(error.httpCode).send(error);
      }
      req.$scope.reporter = reporter;
      next();
    })
    .catch(function (error) {
      const err = lib.errorResponses.internalServerError('Internale Server Error');
      req.logger.error(error, 'POST /api/reports');
      res.status(500).send(err);
    });
}

function addReportToScope (req, res, next) {
  const tags = req.body.tags || [];
  const host = req.$scope.host;
  if (host) {
    tags.concat(host.defaultTags);
  }
  const report = {
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    long: req.body.long,
    lat: req.body.lat,
    tags: tags,
    _reporter: req.body.reporterId,
    _host: req.body.hostId,
    category: req.body.category,
    urgency: req.body.urgency
  };
  req.$scope.preparedReport = req.DB.Report.hydrate(report);
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
      req.logger.error(error, 'POST /api/reports');
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
      req.logger.error(error, 'POST /api/reports');
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
      req.logger.error(error, 'POST /api/reports');
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
      const err = lib.errorResponses.internalServerError('Internale Server Error');
      req.logger.error(error, 'POST /api/reports');
      res.status(500).send(err);
    });
}

function sendEmail (req, res, next) {
  const reporter = req.$scope.reporter;
  const host = req.$scope.host;
  const report = req.$scope.newReport;

  const reporterNotif = mailtemplates.reporterNewReport(report, reporter);
  const hostNotif = mailtemplates.hostNewReport(report, host);
  const mails = [
    { receiver: reporter.email, sender: 'report-api-team@noreply', subject: 'Report: ' + report.title, htmlMessage: reporterNotif },
    { receiver: host.email, sender: 'report-api-team@noreply', subject: 'Report: ' + report.title, htmlMessage: hostNotif }
  ];
  return req.mailer.bulkSimpleMail(mails)
    .then(function (results) {
      req.$scope.sentMails = results;
      req.logger.info(results, 'POST /api/reports');
      next();
    })
    .catch(function (error) {
      req.logger.error(error, 'POST /api/reports');
      next();
    });
}

function respond (req, res) {
  const success = {
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201,
    report: req.$scope.newReport._id
  };
  req.logger.info(success, 'POST /api/reports');
  res.status(201).send(success);
}

module.exports = {
  validateBody,
  checkCategory,
  checkDuplicate,
  validateReporter,
  validateHost,
  addPropertiesToScope,
  savePropertiesToDB,
  addMediasToScope,
  saveMediasToDB,
  addPeopleToScope,
  savePeopleToDB,
  addReportToScope,
  saveReportToDB,
  saveReportToClientReport,
  sendEmail,
  respond
};

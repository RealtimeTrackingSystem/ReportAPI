
const _ = require('lodash');
const lib = require('../../lib');
const mailtemplates = require('../../assets/mailtemplates');

function validateParams (req, res, next) {
  const schema = {
    email: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Email',
      isEmail: {
        errorMessage: 'Invalid Parameter: Email'
      }
    },
    password: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Password',
      isLength: {
        options: { min: 10, max: 20 },
        errorMessage: 'Invalid Parameter Length: Password'
      }
    },
    passwordConfirmation: {
      notEmpty: true,
      errorMessage: 'Missing Parameter: Password',
      isLength: {
        options: { min: 10, max: 20 },
        errorMessage: 'Invalid Parameter Length: Password Confirmation'
      }
    },
    orgName: {
      optional: true,
      isLength: {
        options: { min: 4, max: 20 },
        errorMessage: 'Invalid Parameter Length: Organization Name'
      }
    },
    orgEmail: {
      optional: true,
      isEmail: {
        errorMessage: 'Invalid Parameter: Organization Email'
      }
    },
    orgWebsite: {
      optional: true,
      isLength: {
        options: { min: 4, max: 20 },
        errorMessage: 'Invalid Parameter Length: Organization Website'
      }
    },
    orgBarangay: {
      optional: true,
      isLength: {
        options: { min: 4, max: 20 },
        errorMessage: 'Invalid Parameter Length: Organization Barangay'
      }
    },
    orgStreet: {
      optional: true,
      isLength: {
        options: { min: 4, max: 20 },
        errorMessage: 'Invalid Parameter Length: Organization Street'
      }
    },
    orgCity: {
      optional: true,
      isLength: {
        options: { min: 4, max: 20 },
        errorMessage: 'Invalid Parameter Length: Organization City'
      }
    },
    orgRegion: {
      optional: true,
      isLength: {
        options: { min: 4, max: 20 },
        errorMessage: 'Invalid Parameter Length: Organization Region'
      }
    },
    orgCountry: {
      optional: true,
      isLength: {
        options: { min: 4, max: 20 },
        errorMessage: 'Invalid Parameter Length: Organization Country'
      }
    },
    orgZip: {
      optional: true,
      isLength: {
        options: { min: 4, max: 20 },
        errorMessage: 'Invalid Parameter Length: Organization Zip'
      }
    },
    orgDescription: {
      optional: true,
      isLength: {
        options: { min: 4, max: 255 },
        errorMessage: 'Invalid Parameter Length: Organization Description'
      }
    },
    orgNature: {
      optional: true,
      isLength: {
        options: { min: 4, max: 50 },
        errorMessage: 'Invalid Parameter Length: Organization Nature'
      }
    }
  };
  req.checkBody(schema);
  req.checkBody()
    .equalPasswords(function () {
      return true;
    })
    .withMessage('Invalid Parameter: Password Confirmation');
  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorObject = lib.errorResponses.validationError(validationErrors);
    return res.status(errorObject.httpCode).send(errorObject);
  } else {
    return next();
  }
}

function checkDuplicateOrg (req, res, next) {
  return req.DB.Organization.findWithNameOrEmail(req.body.orgName, req.body.orgEmail)
    .then(function (org) {
      if (org) {
        // req.logger.warn('POST /api/clients', {
        //   status: 'ERROR',
        //   statusCode: 2,
        //   httpCode: 400,
        //   message: 'Invalid Parameter: Organization Name or Email - Already In Use'
        // });
        return res.status(400).send({
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Parameter: Organization Name or Email - Already In Use'
        });
      }
      return next();
    }).catch(function (err) {
      // req.logger.error('POST /api/clients', err);
      const errorObject = lib.errorResponses.internalServerError('Failed in Finding Organization = require(Database');
      return res.status(errorObject.httpCode).send(errorObject);
    });
}

function checkDuplicateClient (req, res, next) {
  return req.DB.Client.findOne({
    $or: [{email: req.body.email}]
  }).then(function (client) {
    if (client) {
      // req.logger.warn('POST /api/clients', {
      //   status: 'ERROR',
      //   statusCode: 2,
      //   httpCode: 400,
      //   message: 'Invalid Parameter: Email - Already In Use'
      // });
      return res.status(400).send({
        status: 'ERROR',
        statusCode: 2,
        httpCode: 400,
        message: 'Invalid Parameter: Email - Already In Use'
      });
    }
    return next();
  }).catch(function (err) {
    // req.logger.error('POST /api/clients', err);
    const errorObject = lib.errorResponses.internalServerError('Failed in Finding Client = require(Database');
    return res.status(errorObject.httpCode).send(errorObject);
  });
}

function addClientToScope (req, res, next) {
  req.$scope.client = req.body;
  return next();
}

function addOrgToScope (req, res, next) {
  if (req.body.organization && req.body.name) {
    const organization = {
      name: req.body.orgName,
      email: req.body.orgEmail,
      wesite: req.body.orgWebsite,
      street: req.body.orgStreet,
      barangay: req.body.orgBarangay,
      city: req.body.orgCity,
      zip: req.body.orgZip,
      region: req.body.orgRegion,
      country: req.body.orgCountry,
      description: req.body.orgDescription,
      orgNature: req.body.orgNature
    };
    req.$scope.organization = organization;
  }
  return next();
}

function saveOrgToDb (req, res, next) {
  if (!req.$scope.organization) {
    return next();
  }
  return req.DB.Organization.add(req.$scope.organization)
    .then(function (organization) {
      req.$scope.newOrganization = organization;
      return next();
    })
    .catch(function (err) {
      // req.logger.error('POST /api/clients', err);
      const errorObject = lib.errorResponses.internalServerError('Failed in Saving Organization to Database');
      return res.status(errorObject.httpCode).send(errorObject);
    });
}

function saveClientToDb (req, res, next) {
  const newClient = _.clone(req.$scope.client);
  if (req.$scope.newOrganization) {
    newClient._organization = req.$scope.newOrganization._id;
  }
  return req.DB.Client.add(newClient)
    .then(function (client) {
      req.$scope.newClient = client;
      return next();
    })
    .catch(function (err) {
      // req.logger.error('POST /api/clients', err);
      const errorObject = lib.errorResponses.internalServerError('Failed in Saving Client to Database');
      return res.status(errorObject.httpCode).send(errorObject);
    });
}

function sendInitialEmail (req, res, next) {
  const client = req.$scope.newClient;
  const organization = req.$scope.organization;
  const initialMail = mailtemplates.sendAPIKey(client, organization);
  return req.mailer
    .simpleMail('REPORTAPITEAM@NOREPLY', client.email, 'REGISTRATION SUCCESS', initialMail)
    .then(function (messageResponse) {
      // req.logger.info('POST /api/clients', {for: 'SendEmail', messageResponse});
      return next();
    })
    .catch(function (err) {
      // req.logger.error('POST /api/clients', err);
      const errorObject = lib.errorResponses.internalServerError('Failed in Sending Email to Client');
      return res.status(errorObject.httpCode).send(errorObject);
    });
}

function respond (req, res) {
  // req.logger.info('POST /api/clients', {
  //   clientID: req.$scope.newClient._id,
  //   apiKey: req.$scope.newClient.apiKey
  // });
  res.status(201).send({
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201,
    client: req.$scope.newClient._id,
    apiKey: req.$scope.newClient.apiKey
  });
}

module.exports = {
  validateParams,
  addClientToScope,
  checkDuplicateClient,
  checkDuplicateOrg,
  addOrgToScope,
  saveOrgToDb,
  saveClientToDb,
  sendInitialEmail,
  respond
};

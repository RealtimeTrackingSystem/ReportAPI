'use strict';

const mailtemplates = require('../../assets/mailtemplates');

const internals = {};
internals.error = function (err, req, res) {
  const error = {
    status: 'ERROR',
    statusCode: 1,
    httpCode: 500,
    message: 'Internal Server Error'
  };
  req.logger.error(err, 'POST /host/approveUserRequest');
  res.status(error.httpCode).send(error);
};

function getReporter (req, res, next) {
  return req.DB.Reporter.findById(req.body.reporterId)
    .then((reporter) => {
      if (!reporter) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Parameter: Reporter Id'
        };
        return res.status(error.httpCode).send(error);
      }
      req.$scope.reporter = reporter;
      next();
    })
    .catch((err) => internals.error(err, req, res));
}

function getHost (req, res, next) {
  return req.DB.Host.findById(req.body.hostId)
    .then((host) => {
      if (!host) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Parameter: Host Id'
        };
        return res.status(error.httpCode).send(error);
      }
      req.$scope.host = host;
      next();
    })
    .catch((err) => internals.error(err, req, res));
}

function sendNotification (req, res, next) {
  const { reporter, host } = req.$scope;
  const message = {
    data: {
      type: 'HOST_REQUEST_APPROVED'
    },
    notification: {
      title: 'Host Request Approved',
      body: `Your Request to Host: ${host.name} has been approved.`
    },
    android: {
      ttl: 3600 * 1000,
      notification: {
        icon: 'ic_menu_gallery',
        click_action: '.HostPageActivity', 
        title: 'Host Request Approved',
        body: `Your Request to Host: ${host.name} has been approved.`,
        color: '#f45342',
        sound: 'default'
      },
    }
  };

  const firebaseTokens = reporter.firebaseTokens;

  const tokens = [];

  if (firebaseTokens != null && Array.isArray(firebaseTokens) && firebaseTokens.length > 0) {
    const fbctokens = firebaseTokens.map(fbt => fbt.token);
    for (let i = 0; i < fbctokens.length; i++) {
      tokens.push(fbctokens[i]);
    }
  }

  if (tokens.length > 0) {
    return req.FCM.sendToMultipleTokenAsync(message, tokens)
      .then(result => {
        req.logger.info(result, 'POST /host/approveUserRequest');
        next();
      })
      .catch(error => {
        req.logger.error(error, 'POST /host/approveUserRequest');
        next();
      });
  } else {
    next();
  }
}

function sendEmail (req, res, next) {
  const { reporter } = req.$scope;
  const notif = mailtemplates.hostRequestApproved(reporter);
  const mails = [{
    receiver: reporter.email, sender: 'report-api-team@noreply', subject: 'Request TO Join Host Approved', htmlMessage: notif
  }];
  return req.mailer.bulkSimpleMail(mails)
    .then(function (results) {
      req.$scope.sentMails = results;
      req.logger.info(results, 'POST /host/approveUserRequest');
      next();
    })
    .catch(function (error) {
      req.logger.error(error, 'POST /host/approveUserRequest');
      next();
    });
}

function respond (req, res) {
  res.status(200).send({
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 201
  });
}

module.exports = {
  getReporter,
  getHost,
  sendNotification,
  sendEmail,
  respond
};

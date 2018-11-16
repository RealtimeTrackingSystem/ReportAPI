/**
 * Reporter Route
 * /api/reporters
 */
const { Router } = require('express');
const handlers = require('../handlers');

const reporterRoute = Router();

reporterRoute.get('/api/reporters/:reporterId',
  handlers.authentication.clientAuth.authenticate,
  handlers.reporters.getReporterById.validateParams,
  handlers.reporters.getReporterById.logic,
  handlers.reporters.getReporterById.respond);

reporterRoute.get('/api/reporters',
  handlers.authentication.clientAuth.authenticate,
  handlers.reporters.getReporters.validateQuery,
  handlers.reporters.getReporters.logic);

reporterRoute.post('/api/reporters',
  handlers.authentication.clientAuth.authenticate,
  handlers.reporters.createReporter.validateBody,
  handlers.reporters.createReporter.logic,
  handlers.reporters.createReporter.respond);

reporterRoute.put('/api/reporters/:reporterId',
  handlers.authentication.clientAuth.authenticate,
  handlers.reporters.createReporter.validateBody,
  handlers.reporters.updateReporter.validateReporter,
  handlers.reporters.updateReporter.logic,
  handlers.reporters.updateReporter.respond);

reporterRoute.put('/api/reporters/profilepic/:reporterId',
  handlers.authentication.clientAuth.authenticate,
  handlers.reporters.updateReporterProfilePic.validateParams,
  handlers.reporters.updateReporterProfilePic.validateReporter,
  handlers.reporters.updateReporterProfilePic.logic,
  handlers.reporters.updateReporterProfilePic.respond);

module.exports = reporterRoute;

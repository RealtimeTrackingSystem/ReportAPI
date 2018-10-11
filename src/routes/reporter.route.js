/**
 * Reporter Route
 * /api/reporters
 */
const { Router } = require('express');
const handlers = require('../handlers');

const reportRoute = Router();

reportRoute.get('/api/reporters/:reporterId',
  handlers.authentication.clientAuth.authenticate,
  handlers.reporters.getReporterById.validateParams,
  handlers.reporters.getReporterById.logic,
  handlers.reporters.getReporterById.respond);

reportRoute.get('/api/reporters',
  handlers.authentication.clientAuth.authenticate,
  handlers.reporters.getReporters.validateQuery,
  handlers.reporters.getReporters.logic);

reportRoute.post('/api/reporters',
  handlers.authentication.clientAuth.authenticate,
  handlers.reporters.createReporter.validateBody,
  handlers.reporters.createReporter.logic,
  handlers.reporters.createReporter.respond);

module.exports = reportRoute;

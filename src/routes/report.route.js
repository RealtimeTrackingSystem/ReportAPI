/**
 * Report Route
 * /api/report
 */
const { Router } = require('express');
const handlers = require('../handlers');

const reportRoute = Router();

reportRoute.get('/api/reports',
  handlers.reports.getReports.logic
);

reportRoute.post('/api/reports',
  handlers.reports.createReport.validateBody,
  handlers.reports.createReport.logic,
  handlers.reports.createReport.respond
);

module.exports = reportRoute;

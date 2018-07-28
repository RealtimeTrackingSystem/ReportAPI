/**
 * Report Route
 * /api/report
 */
const { Router } = require('express');
const handlers = require('../handlers');

const reportRoute = Router();

reportRoute.get('/api/reports',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.getReports.validateQuery,
  handlers.reports.getReports.addTagsToWhereClause,
  handlers.reports.getReports.logic
);

reportRoute.post('/api/reports',
  handlers.authentication.clientAuth.authenticate,
  handlers.reports.createReport.validateBody,
  handlers.reports.createReport.addReportToScope,
  handlers.reports.createReport.addMediasToScope,
  handlers.reports.createReport.saveMediasToDB,
  handlers.reports.createReport.addPeopleToScope,
  handlers.reports.createReport.savePeopleToDB,
  handlers.reports.createReport.addPropertiesToScope,
  handlers.reports.createReport.savePropertiesToDB,
  handlers.reports.createReport.saveReportToClientReport,
  handlers.reports.createReport.saveReportToDB,
  handlers.reports.createReport.respond
);

module.exports = reportRoute;

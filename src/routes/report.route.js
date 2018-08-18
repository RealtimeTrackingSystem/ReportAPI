/**
 * Report Route
 * /api/report
 */
const { Router } = require('express');
const handlers = require('../handlers');

const reportRoute = Router();

reportRoute.put('/api/reports/status/:reportId',
  handlers.reports.putReportStatus.validateBody,
  handlers.reports.putReportStatus.validateStatus,
  handlers.reports.putReportStatus.logic,
  handlers.reports.putReportStatus.respond);

reportRoute.get('/api/reports',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.authenticate,
  handlers.reports.getReports.validateQuery,
  handlers.reports.getReports.addTagsToWhereClause,
  handlers.reports.getReports.logic);

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
  handlers.reports.createReport.respond);

reportRoute.get('/api/reports/:reportId',
  handlers.authentication.clientAuth.authenticate,
  handlers.reports.getReportById.validateResources,
  handlers.reports.getReportById.queryBuilder,
  handlers.reports.getReportById.logic,
  handlers.reports.getReportById.respond);

module.exports = reportRoute;

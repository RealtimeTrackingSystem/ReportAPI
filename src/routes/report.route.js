/**
 * Report Route
 * /api/report
 */
const { Router } = require('express');
const handlers = require('../handlers');

const reportRoute = Router();

reportRoute.get('/api/reports/search/:searchString',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.searchReports.validateQuery,
  handlers.reports.searchReports.validateParams,
  handlers.reports.searchReports.getReports,
  handlers.reports.searchReports.getReportCount,
  handlers.reports.searchReports.respond);

reportRoute.put('/api/reports/status/:reportId',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.putReportStatus.validateBody,
  handlers.reports.putReportStatus.validateStatus,
  handlers.reports.putReportStatus.checkReport,
  handlers.reports.putReportStatus.logic,
  handlers.reports.putReportStatus.sendEmail,
  handlers.reports.putReportStatus.respond);

reportRoute.post('/api/reports/duplicates',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.postDuplicate.validateParams,
  handlers.reports.postDuplicate.duplicate,
  handlers.reports.postDuplicate.sendEmail,
  handlers.reports.postDuplicate.respond);

reportRoute.get('/api/reports',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.getReports.validateQuery,
  handlers.reports.getReports.addTagsToWhereClause,
  handlers.reports.getReports.addOtherOptionsOnWhereClause,
  handlers.reports.getReports.getReports,
  handlers.reports.getReports.getReportCount,
  handlers.reports.getReports.respond);

reportRoute.post('/api/reports',
  handlers.authentication.clientAuth.authenticate,
  handlers.reports.createReport.validateBody,
  handlers.reports.createReport.checkDuplicate,
  handlers.reports.createReport.validateReporter,
  handlers.reports.createReport.validateHost,
  handlers.reports.createReport.addCategoryToScope,
  handlers.reports.createReport.addReportToScope,
  handlers.reports.createReport.addMediasToScope,
  handlers.reports.createReport.saveMediasToDB,
  handlers.reports.createReport.addPeopleToScope,
  handlers.reports.createReport.savePeopleToDB,
  handlers.reports.createReport.addPropertiesToScope,
  handlers.reports.createReport.savePropertiesToDB,
  handlers.reports.createReport.saveReportToClientReport,
  handlers.reports.createReport.saveReportToDB,
  handlers.reports.createReport.sendEmail,
  handlers.reports.createReport.respond);

reportRoute.get('/api/reports/:reportId',
  handlers.authentication.clientAuth.authenticate,
  handlers.reports.getReportById.validateResources,
  handlers.reports.getReportById.queryBuilder,
  handlers.reports.getReportById.logic,
  handlers.reports.getReportById.respond);

module.exports = reportRoute;

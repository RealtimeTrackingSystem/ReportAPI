/**
 * Report Route
 * /api/report
 */
const { Router } = require('express');
const handlers = require('../handlers');

const reportRoute = Router();

reportRoute.put('/api/reports/fileActions/:fileActionId',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.updateFileAction.validateBody,
  handlers.reports.updateFileAction.logic);

reportRoute.post('/api/reports/fileActions',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.addFileAction.validateBody,
  handlers.reports.addFileAction.logic,
  handlers.reports.addFileAction.respond);

reportRoute.post('/api/reports/mediationNotes',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.addMediationNote.validateBody,
  handlers.reports.addMediationNote.logic,
  handlers.reports.addMediationNote.respond);

reportRoute.get('/api/reports/mediationNotes/:mediationNoteId',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.getMediationNoteById.logic);

reportRoute.get('/api/reports/duplicates',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.getDuplicateReports.generateWhereClause,
  handlers.reports.getDuplicateReports.logic,
  handlers.reports.getDuplicateReports.respond);

reportRoute.post('/api/reports/duplicates',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.postDuplicateReport.validateBody,
  handlers.reports.postDuplicateReport.validateReportIds,
  handlers.reports.postDuplicateReport.validateDuplicate,
  handlers.reports.postDuplicateReport.validateParentDuplicate,
  handlers.reports.postDuplicateReport.logic,
  handlers.reports.postDuplicateReport.respond);

reportRoute.put('/api/reports/duplicates',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.putRemoveDuplicateReport.validateBody,
  handlers.reports.putRemoveDuplicateReport.validateReportId,
  handlers.reports.putRemoveDuplicateReport.logic);

reportRoute.post('/api/reports/duplicates/bulk',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.postDuplicate.validateParams,
  handlers.reports.postDuplicate.duplicate,
  handlers.reports.postDuplicate.sendEmail,
  handlers.reports.postDuplicate.respond);

reportRoute.post('/api/v1/reports/mass-update-status',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.reports.massStatusUpdate.validateParams,
  handlers.reports.putReportStatus.addNote,
  handlers.reports.massStatusUpdate.checkReportsToUpdate,
  handlers.reports.massStatusUpdate.logic,
  handlers.reports.massStatusUpdate.respond);

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
  handlers.reports.putReportStatus.addNote,
  handlers.reports.putReportStatus.logic,
  handlers.reports.putReportStatus.updateDuplicates,
  handlers.reports.putReportStatus.sendEmail,
  handlers.reports.putReportStatus.sendNotification,
  handlers.reports.putReportStatus.respond);

reportRoute.delete('/api/reports/status/:reportId',
  handlers.authentication.clientAuth.authenticate,
  handlers.reports.cancelReport.setBody,
  handlers.reports.putReportStatus.validateStatus,
  handlers.reports.putReportStatus.checkReport,
  handlers.reports.putReportStatus.logic,
  handlers.reports.putReportStatus.updateDuplicates,
  handlers.reports.putReportStatus.sendEmail,
  handlers.reports.putReportStatus.sendNotification,
  handlers.reports.putReportStatus.respond);

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
  handlers.reports.createReport.checkCategory,
  handlers.reports.createReport.checkDuplicate,
  handlers.reports.createReport.validateReporter,
  handlers.reports.createReport.validateHost,
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

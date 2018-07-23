/**
 * Report Route
 * /api/report
 */
import { Router } from 'express';
import handlers from '../handlers';

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

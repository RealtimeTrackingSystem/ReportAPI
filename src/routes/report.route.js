/**
 * Report Route
 * /api/report
 */
import { Router } from 'express';
import handlers from '../handlers';

const reportRoute = Router();

reportRoute.get('/api/reports',
  handlers.getReports.logic
);

module.exports = reportRoute;

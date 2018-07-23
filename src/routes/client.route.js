/**
 * Client Route
 * /api/client
 */
import { Router } from 'express';
import handlers from '../handlers';

const clientRoute = Router();
clientRoute.post('/api/clients',
  handlers.clients.addClient.validateParams,
  handlers.clients.addClient.checkDuplicateClient,
  handlers.clients.addClient.checkDuplicateOrg,
  handlers.clients.addClient.addClientToScope,
  handlers.clients.addClient.addOrgToScope,
  handlers.clients.addClient.saveOrgToDb,
  handlers.clients.addClient.saveClientToDb,
  handlers.clients.addClient.respond
);

module.exports = clientRoute;

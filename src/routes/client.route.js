/**
 * Client Route
 * /api/client
 */
const { Router } = require('express');
const handlers = require('../handlers');

const clientRoute = Router();
clientRoute.post('/api/clients',
  handlers.clients.addClient.validateParams,
  handlers.clients.addClient.checkDuplicateClient,
  handlers.clients.addClient.checkDuplicateOrg,
  handlers.clients.addClient.addClientToScope,
  handlers.clients.addClient.addOrgToScope,
  handlers.clients.addClient.saveOrgToDb,
  handlers.clients.addClient.saveClientToDb,
  handlers.clients.addClient.sendInitialEmail,
  handlers.clients.addClient.respond
);

module.exports = clientRoute;

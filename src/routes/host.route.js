/**
 * Host Route
 * /api/hosts
 */
const { Router } = require('express');
const handlers = require('../handlers');

const hostRoute = Router();

hostRoute.get('/api/hosts',
  handlers.authentication.clientAuth.authenticate,
  handlers.hosts.getHosts.validateQuery,
  handlers.hosts.getHosts.logic);

hostRoute.post('/api/hosts',
  handlers.authentication.clientAuth.authenticate,
  handlers.hosts.createHost.validateBody,
  handlers.hosts.createHost.checkDuplicates,
  handlers.hosts.createHost.logic,
  handlers.hosts.createHost.respond);

hostRoute.get('/api/hosts/:hostId',
  handlers.authentication.clientAuth.authenticate,
  handlers.hosts.getHostById.validateParams,
  handlers.hosts.getHostById.queryBuilder,
  handlers.hosts.getHostById.logic,
  handlers.hosts.getHostById.respond);

module.exports = hostRoute;

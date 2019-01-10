/**
 * Host Route
 * /api/hosts
 */
const { Router } = require('express');
const handlers = require('../handlers');

const hostRoute = Router();

hostRoute.post('/api/hosts/approveUserRequest',
  handlers.authentication.clientAuth.authenticate,
  handlers.hosts.approveUserRequest.getReporter,
  handlers.hosts.approveUserRequest.getHost,
  handlers.hosts.approveUserRequest.checkType,
  handlers.hosts.approveUserRequest.sendNotification,
  handlers.hosts.approveUserRequest.sendEmail,
  handlers.hosts.approveUserRequest.respond);

hostRoute.get('/api/hosts/search-paginated/:searchString',
  handlers.authentication.clientAuth.authenticate,
  handlers.hosts.searchHostPaginated.validateQuery,
  handlers.hosts.searchHostPaginated.logic);

hostRoute.put('/api/hosts/approval/:hostId',
  handlers.authentication.clientAuth.authenticate,
  handlers.hosts.approveHost.checkHost,
  handlers.hosts.approveHost.checkClient,
  handlers.hosts.approveHost.logic,
  handlers.hosts.approveHost.respond);

hostRoute.put('/api/hosts/disapproval/:hostId',
  handlers.authentication.clientAuth.authenticate,
  handlers.hosts.disapproveHost.checkHost,
  handlers.hosts.disapproveHost.checkClient,
  handlers.hosts.disapproveHost.logic,
  handlers.hosts.disapproveHost.respond);

hostRoute.get('/api/hosts/search/:searchString',
  handlers.authentication.clientAuth.authenticate,
  handlers.hosts.searchHost.validateParams,
  handlers.hosts.searchHost.logic,
  handlers.hosts.searchHost.respond);

hostRoute.get('/api/hosts',
  handlers.authentication.clientAuth.authenticate,
  handlers.hosts.getHosts.validateQuery,
  handlers.hosts.getHosts.processFilter,
  handlers.hosts.getHosts.setOtherOptions,
  handlers.hosts.getHosts.getHostCount,
  handlers.hosts.getHosts.logic,
  handlers.hosts.getHosts.respond);

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

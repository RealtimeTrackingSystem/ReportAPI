/**
 * People Route
 * /api/people
 */
const { Router } = require('express');
const handlers = require('../handlers');

const peopleRoute = Router();

peopleRoute.get('/api/people',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.people.searchPeople.validateQuery,
  handlers.people.searchPeople.getPeople);

peopleRoute.post('/api/people/summons',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.people.sendSummon.validateBody,
  handlers.people.sendSummon.logic,
  handlers.people.sendSummon.respond);

peopleRoute.get('/api/people/summons/:summonId',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.people.getSummonById.logic);

peopleRoute.put('/api/people/summons/:summonId',
  handlers.authentication.clientAuth.authenticate,
  handlers.authentication.clientAuth.logActivity,
  handlers.people.updateSummon.validateBody,
  handlers.people.updateSummon.checkSummon,
  handlers.people.updateSummon.logic);

module.exports = peopleRoute;

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

module.exports = peopleRoute;

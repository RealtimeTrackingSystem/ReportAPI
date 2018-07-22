require('mongoose');
import DB from '../../../models';
const Report = DB.Report;

const all = [
  new Report({
    title: 'Title 1',
    description: 'Description 1',
    location: 'Location 1',
    long: 45.4,
    lat: 50.2,
    _reporter: '5b505a9915a1fe228326cda4',
    _host: '5b505b9f936f9222cef28ff4',
    reportCoordinates: {
      type: 'Point',
      coordinates: [45.5, 50.2]
    },
    tags: [
      'test',
      'title'
    ],
    people: [],
    medias: [],
    properties: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  new Report({
    title: 'Title 1',
    description: 'Description 1',
    location: 'Location 1',
    long: 45.4,
    lat: 50.2,
    _reporter: '5b505a9915a1fe228326cda4',
    _host: '5b505b9f936f9222cef28ff4',
    reportCoordinates: {
      type: 'Point',
      coordinates: [45.5, 50.2]
    },
    tags: [
      'test',
      'title'
    ],
    people: [],
    medias: [],
    properties: [],
    createdAt: new Date(),
    updatedAt: new Date()
  })
];

export default {
  all
};

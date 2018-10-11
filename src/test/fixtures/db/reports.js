const DB = require('../../../models');
const Report = DB.Report;

const all = [
  new Report({
    '_id': '5b56c6ec58d80a0f6404cf93',
    'reportCoordinates': {
      'type': 'Point',
      'coordinates': [
        23424,
        23234
      ]
    },
    'status': 'NEW',
    'people': [
      '5b56c6ec58d80a0f6404cf94'
    ],
    'properties': [
      '5b56c6ec58d80a0f6404cf95'
    ],
    'medias': [],
    'tags': [
      'sample2',
      '5',
      'Ikot'
    ],
    'title': 'Sample5 Report',
    'description': 'Sample5 Description',
    'location': 'Sample5 Location',
    'long': 23424,
    'lat': 23234,
    'createdAt': '2018-07-24T06:27:56.141Z',
    'updatedAt': '2018-07-24T06:27:56.141Z'
  }),
  new Report({
    '_id': '5b56c5f625a2f60f3b2f7489',
    'reportCoordinates': {
      'type': 'Point',
      'coordinates': [
        23424,
        23234
      ]
    },
    'status': 'NEW',
    'people': [
      '5b56c5f625a2f60f3b2f748a'
    ],
    'properties': [
      '5b56c5f625a2f60f3b2f748b'
    ],
    'medias': [],
    'tags': [
      'sample2',
      '4'
    ],
    'title': 'Sample4 Report',
    'description': 'Sample4 Description',
    'location': 'Sample4 Location',
    'long': 23424,
    'lat': 23234,
    'createdAt': '2018-07-24T06:23:50.604Z',
    'updatedAt': '2018-07-24T06:23:50.604Z'
  })
];

module.exports = {
  all
};

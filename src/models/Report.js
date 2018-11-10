const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const REPORT_LIST =  [ 'NEW', 'VALIDATED', 'INPROGRESS', 'DONE', 'EXPIRED', 'VOID'];
const ALLOWED_RESOURCES = ['reporter', 'host', 'people', 'properties', 'medias'];

const ReportSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String },
  location: { type: String },
  long: { type: Number },
  lat: { type: Number },
  _reporter: { type:Types.ObjectId, ref: 'Reporter', required: true },
  _host: { type: Types.ObjectId, ref: 'Host' },
  status: { type: String, enum: [ 'NEW', 'VALIDATED', 'INPROGRESS', 'DONE', 'EXPIRED', 'VOID'], default: 'NEW' },
  reportCoordinates: {
    type: {type: String, enum: 'Point', default: 'Point'},
    coordinates: { type: [Number], default: [0, 0]}
  },
  people: [{
    type: Types.ObjectId, ref: 'Person'
  }],
  properties: [{
    type: Types.ObjectId, ref: 'Property'
  }],
  medias: [{
    type: Types.ObjectId, ref: 'Media'
  }],
  attachments: [{
    type: Types.ObjectId, ref: 'Attachment'
  }],
  tags: [String],
  duplicates: [{
    type: Types.ObjectId, ref: 'Report'
  }],
  duplicateParent: { type: Types.ObjectId, ref: 'Report', default: null },
  urgency: { type: String, enum: [ 'EMERGENCY', 'CRITICAL', 'PRIORITY', 'MEDIUM', 'LOW' ], default: 'LOW' }
}, { timestamps: true });

ReportSchema.index({reportCoordinate: '2dsphere'});

ReportSchema.statics.hydrate = function (report) {
  return new Report({
    title: report.title,
    description: report.description,
    location: report.location,
    long: report.long,
    lat: report.lat,
    tags: report.tags,
    people: report.people,
    properties: report.properties,
    medias: report.medias,
    reportCoordinates: {
      type: 'Point',
      coordinates: [report.long, report.lat]
    },
    _reporter: report._reporter,
    _host: report._host
  });
};

ReportSchema.statics.add = function (report) {
  const newReport = new Report({
    title: report.title,
    description: report.description,
    location: report.location,
    long: report.long,
    lat: report.lat,
    tags: report.tags,
    people: report.people,
    properties: report.properties,
    medias: report.medias,
    reportCoordinates: {
      type: 'Point',
      coordinates: [report.long, report.lat]
    },
    _reporter: report._reporter,
    _host: report._host
  });
  return newReport.save();
};

ReportSchema.statics.findPaginated = function (query = {}, page, limit, resources) {
  const allowedLimit = limit < 31 ? limit : 30;
  const offset = page * allowedLimit;
  const ReportQuery = Report.find(query);
  if (resources.indexOf('reporter') > -1) {
    ReportQuery.populate('_reporter');
  }

  if (resources.indexOf('host') > -1) {
    ReportQuery.populate('_host');
  }

  if (resources.indexOf('people') > -1) {
    ReportQuery.populate('people');
  }

  if (resources.indexOf('properties') > -1) {
    ReportQuery.populate('properties');
  }

  if (resources.indexOf('medias') > -1) {
    ReportQuery.populate('medias');
  }
  ReportQuery.populate('category');
  ReportQuery.populate('duplicates');
  ReportQuery.populate('duplicateParent');

  if (limit) {
    return ReportQuery.skip(offset).limit(allowedLimit).sort('-updatedAt');
  } else {
    return ReportQuery.skip(offset).sort('-updatedAt');
  }
};

ReportSchema.statics.statusCanBeUpdated = function (_id, status) {
  return Report.findById(_id)
    .then(function (report) {
      if (!report) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Resource: Report ID'
        };
        throw error;
      }
      if (REPORT_LIST.indexOf(status.toUpperCase()) < 0) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Resource: Status - Unknown Status [' + status + ']'
        };
        throw error;
      }
      if (REPORT_LIST.indexOf(report.status)
        >= REPORT_LIST.indexOf(status.toUpperCase())) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Resource: Status'
        };
        throw error;
      }
      return report;
    });
};

ReportSchema.statics.updateStatus = function (_id, status) {
  return Report.findByIdAndUpdate(_id, {status: status.toUpperCase()})
    .then(function () {
      return Report.findById(_id);
    });
};

ReportSchema.statics.search = function (searchString) {
  return Report.find({
    $or: [
      { title: { $regex: searchString, $options: 'i' } },
      { description: { $regex: searchString, $options: 'i' } },
      { location: { $regex: searchString, $options: 'i' } }
    ]
  });
};

ReportSchema.statics.searchPaginated = function (searchString, page, limit, resources) {
  const allowedLimit = limit < 31 ? limit : 30;
  const offset = page * allowedLimit;
  const ReportQuery = Report.find({
    $or: [
      { title: { $regex: searchString, $options: 'i' } },
      { description: { $regex: searchString, $options: 'i' } },
      { location: { $regex: searchString, $options: 'i' } }
    ]
  });
  if (resources.indexOf('reporter') > -1) {
    ReportQuery.populate('_reporter');
  }

  if (resources.indexOf('host') > -1) {
    ReportQuery.populate('_host');
  }

  if (resources.indexOf('people') > -1) {
    ReportQuery.populate('people');
  }

  if (resources.indexOf('properties') > -1) {
    ReportQuery.populate('properties');
  }

  if (resources.indexOf('medias') > -1) {
    ReportQuery.populate('medias');
  }
  if (limit) {
    return ReportQuery.skip(offset).limit(allowedLimit).sort('-updatedAt');
  } else {
    return ReportQuery.skip(offset).sort('-updatedAt');
  }
};

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;

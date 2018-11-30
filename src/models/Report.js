const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;
const Promise = require('bluebird');
const _ = require('lodash');

const REPORT_LIST =  [ 'NEW', 'VALIDATED', 'INPROGRESS', 'DONE', 'EXPIRED', 'VOID', 'INVALID'];
const ALLOWED_RESOURCES = ['reporter', 'host', 'people', 'properties', 'medias'];

const ReportSchema = new Schema({
  title: { type: String, required: true, index: true  },
  description: { type: String, index: true  },
  location: { type: String, index: true  },
  long: { type: Number, index: true  },
  lat: { type: Number, index: true  },
  _reporter: { type: Types.ObjectId, ref: 'Reporter', required: true, index: true  },
  _host: { type: Types.ObjectId, ref: 'Host', index: true  },
  status: { type: String, enum: [ 'NEW', 'VALIDATED', 'INPROGRESS', 'DONE', 'EXPIRED', 'VOID', 'INVALID'], default: 'NEW', index: true  },
  reportCoordinates: {
    type: {type: String, enum: 'Point', default: 'Point', index: true },
    coordinates: { type: [Number], default: [0, 0], index: true }
  },
  people: [{
    type: Types.ObjectId, ref: 'Person', index: true 
  }],
  properties: [{
    type: Types.ObjectId, ref: 'Property', index: true 
  }],
  medias: [{
    type: Types.ObjectId, ref: 'Media', index: true 
  }],
  attachments: [{
    type: Types.ObjectId, ref: 'Attachment', index: true 
  }],
  tags: [String],
  duplicates: [{
    type: Types.ObjectId, ref: 'Report', index: true 
  }],
  isDuplicate: { type: Boolean, default: false },
  notes: [{ type: Types.ObjectId, ref: 'Note', index: true }],
  duplicateParent: { type: Types.ObjectId, ref: 'Report', default: null, index: true  },
  urgency: { type: String, enum: [ 'EMERGENCY', 'MEDIUM', 'LOW' ], default: 'LOW', index: true  },
  category: {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true, index: true }
  }
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
    _host: report._host,
    category: report.category
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
    _host: report._host,
    category: report.category
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
  ReportQuery.populate('notes');
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
          message: 'Invalid Parameter: Report ID'
        };
        throw error;
      }
      if (REPORT_LIST.indexOf(status.toUpperCase()) < 0) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Parameter: Status - Unknown Status [' + status + ']'
        };
        throw error;
      }
      if (report.status === 'VOID') {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Parameter: Status - Status already VOID'
        };
        throw error;
      }
      if (REPORT_LIST.indexOf(report.status)
        >= REPORT_LIST.indexOf(status.toUpperCase())) {
        const error = {
          status: 'ERROR',
          statusCode: 2,
          httpCode: 400,
          message: 'Invalid Parameter: Status'
        };
        throw error;
      }
      return report;
    });
};

ReportSchema.statics.updateStatus = function (_id, status, _note) {
  return Report.findByIdAndUpdate(_id, {
    status: status.toUpperCase(),
    $push: { notes: _note }
  })
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

ReportSchema.statics.searchPaginated = function (searchString, page, limit, options = {}) {
  const allowedLimit = limit < 31 ? limit : 30;
  const offset = page * allowedLimit;
  const query = {
    $or: [
      { title: { $regex: searchString, $options: 'i' } },
      { description: { $regex: searchString, $options: 'i' } },
      { location: { $regex: searchString, $options: 'i' } },
      { urgency: { $regex: searchString.toUpperCase(), $options: 'i' } },
      { 'category.name': { $regex: searchString, $options: 'i' } },
      { 'category.description': { $regex: searchString, $options: 'i' } },
      { status: { $regex: searchString.toUpperCase(), $options: 'i' } },
      { tags: {
        $elemMatch: {
          $in: [searchString]
        }
      }}
    ]
  };
  if (options.isDuplicate != null ) {
    query.$or.push({
      isDuplicate: options.isDuplicate
    });
  }
  const ReportQuery = Report.find(query);
  ReportQuery.populate('_reporter');
  ReportQuery.populate('_host');
  ReportQuery.populate('people');
  ReportQuery.populate('properties');
  ReportQuery.populate('medias');
  ReportQuery.populate('duplicates');
  ReportQuery.populate('duplicateParent');
  ReportQuery.populate('notes');
  if (limit) {
    return ReportQuery.skip(offset).limit(allowedLimit).sort('-updatedAt');
  } else {
    return ReportQuery.skip(offset).sort('-updatedAt');
  }
};

ReportSchema.statics.duplicateReport = function (original, duplicate) {

  return Promise.map([original, duplicate],
    reportId => Report.findById(reportId)
      .populate('_host')
      .populate('_reporter')
  )
    .spread((originalReport, duplicateReport) => {
      if (!originalReport || ! duplicateReport) {
        throw {
          success: false,
          reason: 'Invalid Parameter: Duplicate Object'
        };
      }
      if (duplicateReport.duplicates.length > 0) {
        throw {
          success: false,
          reason: 'Invalid Parameter: Duplicate Report ID'
        };
      }
      if (originalReport.duplicateParent) {
        throw {
          success: false,
          reason: 'Invalid Parameter: Original Report ID'
        };
      }
      if (duplicateReport.duplicateParent) {
        throw {
          success: true,
          reason: 'Report is already set as duplicate'
        };
      }
      let newDuplicates;
      const duplicated = _.find(originalReport.duplicates, (dup) => {
        return dup.toString() == duplicateReport._id;
      });
      if (duplicated) {
        newDuplicates = originalReport.duplicates;
      } else {
        newDuplicates = originalReport.duplicates.concat([duplicateReport._id]);
      }
      const updateOriginal = Report.findByIdAndUpdate(originalReport._id, {
        duplicates: newDuplicates
      });
      const updateDuplicate = Report.findByIdAndUpdate(duplicateReport._id, {
        duplicateParent: originalReport._id,
        isDuplicate: true
      });
      return Promise.all([updateOriginal, updateDuplicate]);
    });
};

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;

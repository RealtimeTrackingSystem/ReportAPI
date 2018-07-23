const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const ReportSchema = new Schema({
  // generatedID: { type: String, unique: true }, requires category
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  long: { type: Number },
  lat: { type: Number },
  _reporter: { type:Types.ObjectId, ref: 'Reporter' },
  _host: { type: Types.ObjectId, ref: 'Host' },
  status: { type: String, enum: [ 'NEW', 'INPROGRESS', 'DONE', 'EXPIRED'], default: 'NEW' },
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
  tags: [String]
}, { timestamps: true });

ReportSchema.index({reportCoordinate: '2dsphere'});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;

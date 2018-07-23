const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const ClientReportSchema = new Schema({
  _report: { type: Types.ObjectId, ref: 'Report' },
  _client: { type: Types.ObjectId, ref: 'Client'}
}, { timestamps: true });

const ClientReport = mongoose.model('ClientReport', ClientReportSchema);

module.exports = ClientReport;

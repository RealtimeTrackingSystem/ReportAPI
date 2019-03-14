const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const ClientReportSchema = new Schema({
  _report: { type: Types.ObjectId, ref: 'Report', index: true  },
  _client: { type: Types.ObjectId, ref: 'Client', index: true }
}, { timestamps: true });

ClientReportSchema.statics.add = function (clientReport) {
  const newClientReport = new ClientReport({
    _report: clientReport._report,
    _client: clientReport._client
  });
  return newClientReport.save();
};

const ClientReport = mongoose.model('ClientReport', ClientReportSchema);

module.exports = ClientReport;

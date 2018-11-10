const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttachmentSchema = new Schema({
  _report: { type: Schema.Types.ObjectId, ref: 'Report' },
  platform: { type: String, required: true },
  metaData: { type: Object, required: true }
}, { timestamps: true });

const Attachment = mongoose.model('Attachment', AttachmentSchema);

module.exports = Attachment;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttachmentSchema = new Schema({
  _report: { type: Schema.Types.ObjectId, ref: 'Report', index: true  },
  platform: { type: String, required: true, index: true  },
  metaData: { type: Object, required: true, index: true  }
}, { timestamps: true });

const Attachment = mongoose.model('Attachment', AttachmentSchema);

module.exports = Attachment;

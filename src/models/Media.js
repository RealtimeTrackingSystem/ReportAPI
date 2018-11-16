const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const MediaSchema = new Schema({
  _report: { type: Types.ObjectId, ref: 'Report', required: true, index: true  },
  platform: { type: String, required: true, index: true },
  metaData: { type: Object, required: true, index: true  }
}, { timestamps: true });

const Media = mongoose.model('Media', MediaSchema);

module.exports = Media;

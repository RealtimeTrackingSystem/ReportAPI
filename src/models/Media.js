const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const MediaSchema = new Schema({
  _report: { type: Types.ObjectId, ref: 'Report', required: true },
  platform: { type: String, required: true },
  metaData: { type:String, required: true }
}, { timestamps: true });

const Media = mongoose.model('Media', MediaSchema);

module.exports = Media;

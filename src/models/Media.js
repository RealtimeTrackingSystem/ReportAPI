import mongoose from 'mongoose';
const { Schema } = mongoose;
const { Types } = Schema;

const MediaSchema = new Schema({
  _report: { type: Types.ObjectId, ref: 'Report' },
  platform: { type: String },
  metaData: { type:String }
}, { timestamps: true });

const Media = mongoose.model('Media', MediaSchema);

export default Media;

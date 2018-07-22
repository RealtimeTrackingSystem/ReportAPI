import mongoose from 'mongoose';
const { Schema } = mongoose;
const { Types } = Schema;

const ReporterSchema = new Schema({
  _report: { type: Types.ObjectId, ref: 'Report' },
  fname: { type: String },
  lname: { type: String },
  alias: { type: String },
  age: { type: Number },
  street: { type: String },
  baranggay: { type: String },
  city: { type: String },
  region: { type: String },
  country: { type: String }
}, { timestamps: true })

const Reporter = mongoose.model('Reporter', ReporterSchema);

export default Reporter;

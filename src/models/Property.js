import mongoose from 'mongoose';
const { Schema } = mongoose;
const { Types } = Schema;

const PropertySchema = new Schema({
  _report: { type: Types.ObjectId, ref: 'Report' },
  type: { type: String },
  owner: { type: String },
  description: { type: String },
  estimatedCost: { type: Number }
}, { timestamps: true });

const Property = mongoose.model('Property', PropertySchema);

export default Property;

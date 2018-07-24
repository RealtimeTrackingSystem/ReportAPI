const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const PropertySchema = new Schema({
  _report: { type: Types.ObjectId, ref: 'Report', required: true },
  type: { type: String, required: true },
  owner: { type: String },
  description: { type: String },
  estimatedCost: { type: Number }
}, { timestamps: true });

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;

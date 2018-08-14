const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReporterSchema = new Schema({
  fname: { type: String },
  lname: { type: String },
  alias: { type: String },
  age: { type: Number },
  street: { type: String },
  barangay: { type: String },
  city: { type: String },
  region: { type: String },
  country: { type: String }
}, { timestamps: true });

const Reporter = mongoose.model('Reporter', ReporterSchema);

module.exports = Reporter;

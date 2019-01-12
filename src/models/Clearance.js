const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClearanceSchema = new Schema({
  clearanceNotes: { type: String, required: true },
  _reporter: { type: Schema.Types.ObjectId, ref: 'Reporter' },
  reporterMetaData: { type: Object, required: true }
}, { timestamps: true });

const Clearance = mongoose.model('Clearance', ClearanceSchema);

module.exports = Clearance;

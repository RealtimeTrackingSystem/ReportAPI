const mongoose = require('mongoose');
const { Schema } = mongoose;

const SummonSchema = new Schema({
  _person: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  type: { type: String, enum: ['INVESTIGATION'], default: 'INVESTIGATION' },
  count: { type: Number, enum: [1, 2, 3], required: true },
  description: { type: String },
  compliance: { type: String, enum: ['NEW', 'COMPLIED', 'NOTCOMPLIED'], default: 'NEW' },
  complianceNotes: { type: String }
}, { timestamps: true });

const Summon = mongoose.model('Summon', SummonSchema);

module.exports = Summon;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const MediationNoteSchema = new Schema({
  note: { type: String, required: true },
  _reporter: { type: Schema.Types.ObjectId, ref: 'Reporter' },
  _media: { type: Schema.Types.ObjectId, ref: 'Attachment' },
  _report: { type: Schema.Types.ObjectId, ref: 'Report' }
}, { timestamps: true });

const MediationNote = mongoose.model('MediationNote', MediationNoteSchema);

module.exports = MediationNote;

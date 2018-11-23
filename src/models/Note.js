const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const NoteSchema = new Schema({
  _report: { type: Types.ObjectId, ref: 'Report', required: true, index: true  },
  text: { type: String, required: true }
}, { timestamps: true });

NoteSchema.statics.add = function (_report, text) {
  const newNote = new Note({
    _report: _report,
    text: text
  });
  return newNote.save();
};

const Note = mongoose.model('Note', NoteSchema);


module.exports = Note;

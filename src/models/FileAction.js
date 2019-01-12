const mongoose = require('mongoose');
const { Schema } = mongoose;

const FileActionSchema = new Schema({
  note: { type: String, required: true },
  status: { type: String, enum: ['Sent', 'Resolved'], default: 'Sent' }
}, { timestamps: true });

const FileAction = mongoose.model('FileAction', FileActionSchema);

module.exports = FileAction;

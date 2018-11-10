const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  text: { type: String, required: true },
  _report: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
  fromHost: { type: Boolean, required: true, default: false },
  _host: { type: Schema.Types.ObjectId, ref: 'Host' },
  _reporter: { type: Schema.Types.ObjectId, ref: 'Reporter' },
  attachment: { type: Schema.Types.ObjectId, ref: 'Attachment' }
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;

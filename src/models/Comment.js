const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  text: { type: String, required: true, index: true  },
  _report: { type: Schema.Types.ObjectId, ref: 'Report', required: true, index: true  },
  fromHost: { type: Boolean, required: true, default: false, index: true  },
  _host: { type: Schema.Types.ObjectId, ref: 'Host', index: true  },
  _reporter: { type: Schema.Types.ObjectId, ref: 'Reporter', index: true  },
  attachment: { type: Schema.Types.ObjectId, ref: 'Attachment', index: true  }
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;

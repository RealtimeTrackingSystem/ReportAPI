const mongoose = require('mongoose');
const { Schema } = mongoose;

const PictureSchema = new Schema({
  platform: { type: String, required: true },
  metaData: { type: Object, required: true }
}, { timestamps: true });

const Picture = mongoose.model('Picture', PictureSchema);

module.exports = Picture;

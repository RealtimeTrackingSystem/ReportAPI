const mongoose = require('mongoose');
const { Schema } = mongoose;

const PictureSchema = new Schema({
  platform: { type: String, required: true, index: true  },
  metaData: { type: Object, required: true, index: true  }
}, { timestamps: true });

PictureSchema.statics.add = function (picture) {
  const newPic = Picture({
    platform: picture.platform,
    metaData: picture.metaData
  });
  return newPic.save();
};

const Picture = mongoose.model('Picture', PictureSchema);

module.exports = Picture;

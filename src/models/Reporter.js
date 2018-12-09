const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');
const _ = require('lodash');

const ReporterSchema = new Schema({
  fname: { type: String, index: true  },
  lname: { type: String, index: true  },
  email: { type: String, index: true  },
  alias: { type: String, index: true  },
  gender: { type: String, enum: ['M', 'F'], default: 'M', index: true },
  street: { type: String, index: true  },
  barangay: { type: String, index: true  },
  city: { type: String, index: true  },
  region: { type: String, index: true  },
  country: { type: String, index: true  },
  zip: { type: String, index: true  },
  profilePicture: { type: Schema.Types.ObjectId, ref: 'Picture', index: true  },
  birthday: { type: String, required: true },
  firebaseTokens: [{
    deviceId: { type: String, required: true, index: true },
    platform: { type: String, enum: ['IOS', 'ANDROID', 'WEB'], default: 'ANDROID' },
    token: { type: String, required: true, index: true }
  }]
}, { timestamps: true, getters: true, virtuals: true });

ReporterSchema.set('toObject', { getters: true, virtuals: true });

ReporterSchema.virtual('age').get(function () {
  return moment().diff(this.birthday, 'years');
});

ReporterSchema.statics.add = function (reporter) {
  const newReporter = new Reporter({
    fname: reporter.fname,
    lname: reporter.lname,
    email: reporter.email,
    alias: reporter.alias,
    gender: reporter.gender,
    street: reporter.street,
    barangay: reporter.barangay,
    city: reporter.city,
    region: reporter.region,
    country: reporter.country,
    zip: reporter.zip,
    profilePicture: reporter.profilePicture,
    birthday: reporter.birthday
  });
  return newReporter.save();
};

ReporterSchema.statics.hydrate = function (reporter) {
  return new Reporter({
    fname: reporter.fname,
    lname: reporter.lname,
    email: reporter.email,
    gender: reporter.gender,
    alias: reporter.alias,
    street: reporter.street,
    barangay: reporter.barangay,
    city: reporter.city,
    region: reporter.region,
    country: reporter.country,
    zip: reporter.zip,
    profilePicture: reporter.profilePicture,
    birthday: reporter.birthday
  });
};

ReporterSchema.statics.findPaginated = function (query = {}, page, limit) {
  const allowedLimit = limit < 31 ? limit : 30;
  const offset = page * allowedLimit;
  return Reporter.find(query).skip(offset).limit(allowedLimit).sort('-createdAt');
};

ReporterSchema.statics.addOrUpdateDevice = async ({ reporterId, deviceId, token, platform }) => {
  try {
    const reporter = await Reporter.findOne({ _id: reporterId }).populate('firebaseTokents');
    const firebaseTokens = reporter.firebaseTokens;
    const firebaseToken = _.find(firebaseTokens, (fbt) => {
      return fbt.deviceId === deviceId;
    });
    let newFirebaseTokens;
    if (firebaseToken) {
      newFirebaseTokens = firebaseTokens.reduce((pv, cv) => {
        if (cv.deviceId === deviceId) {
          return pv.concat([{ deviceId: cv.deviceId, token: token, platform: cv.platform || 'ANDROID' }]);
        } else {
          return pv.concat([{ deviceId: cv.deviceId, token: cv.token, platform: cv.platform || 'ANDROID' }]);
        }
      }, []);
    }
    let update;
    if (newFirebaseTokens && Array.isArray(newFirebaseTokens)) {
      update = await Reporter.findOneAndUpdate({ _id: reporterId }, {
        firebaseTokens: newFirebaseTokens
      });
    } else {
      update = await Reporter.findOneAndUpdate({ _id: reporterId }, {
        $addToSet: { firebaseTokens: { deviceId: deviceId, token: token, platform: platform || 'ANDROID' }}
      });
    }
    return update;
  }
  catch (e) {
    throw e;
  }
};

const Reporter = mongoose.model('Reporter', ReporterSchema);

module.exports = Reporter;

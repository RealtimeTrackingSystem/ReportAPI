const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');

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
  birthday: { type: String, required: true }
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

const Reporter = mongoose.model('Reporter', ReporterSchema);

module.exports = Reporter;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReporterSchema = new Schema({
  fname: { type: String },
  lname: { type: String },
  email: { type: String },
  alias: { type: String },
  age: { type: Number },
  street: { type: String },
  barangay: { type: String },
  city: { type: String },
  region: { type: String },
  country: { type: String },
  zip: { type: String },
  profilePicture: { type: Schema.Types.ObjectId, ref: 'Picture' }
}, { timestamps: true });

ReporterSchema.statics.add = function (reporter) {
  const newReporter = new Reporter({
    fname: reporter.fname,
    lname: reporter.lname,
    email: reporter.email,
    alias: reporter.alias,
    age: reporter.age,
    street: reporter.street,
    barangay: reporter.barangay,
    city: reporter.city,
    region: reporter.region,
    country: reporter.country,
    zip: reporter.zip,
    profilePicture: reporter.profilePicture
  });
  return newReporter.save();
};

ReporterSchema.statics.hydrate = function (reporter) {
  return new Reporter({
    fname: reporter.fname,
    lname: reporter.lname,
    email: reporter.email,
    alias: reporter.alias,
    age: reporter.age,
    street: reporter.street,
    barangay: reporter.barangay,
    city: reporter.city,
    region: reporter.region,
    country: reporter.country,
    zip: reporter.zip,
    profilePicture: reporter.profilePicture
  });
};

ReporterSchema.statics.findPaginated = function (query = {}, page, limit) {
  const allowedLimit = limit < 31 ? limit : 30;
  const offset = page * allowedLimit;
  return Reporter.find(query).skip(offset).limit(allowedLimit).sort('-createdAt');
};

const Reporter = mongoose.model('Reporter', ReporterSchema);

module.exports = Reporter;

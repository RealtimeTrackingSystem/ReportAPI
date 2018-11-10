const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const HostSchema = new Schema({
  name: { type: String, unique: false, required: true },
  email: { type: String, unique: true, required: true  },
  location: { type: String },
  description: { type: String },
  hostNature: { type: String },
  defaultTags: [String],
  long: { type: Number },
  lat: { type: Number },
  hostCoordinates: {
    type: {type: String, enum: 'Point', default: 'Point'},
    coordinates: { type: [Number], default: [0, 0]}
  },
  street: { type: String },
  barangay: { type: String },
  city: { type: String },
  region: { type: String },
  country: { type: String },
  zip: { type: String },
  profilePic: { type: Types.ObjectId, ref: 'Media' },
  category: { type: Types.ObjectId, ref: 'Category' }
}, { timestamps: true });

HostSchema.statics.hydrate = function (host) {
  return new Host({
    name: host.name,
    email: host.email,
    location: host.location,
    description: host.description,
    hostNature: host.hostNature,
    defaultTags: host.defaultTags.concat([host.name]),
    long: host.long,
    lat: host.lat,
    hostCoordinates: {
      type: 'Point',
      coordinates: [host.long, host.lat]
    },
    street: host.street,
    barangay: host.barangay,
    city: host.city,
    region: host.region,
    country: host.country,
    zip: host.zip,
    profilePic: host.profilePic
  });
};

HostSchema.statics.add = function (host) {
  const newHost = new Host({
    name: host.name,
    email: host.email,
    location: host.location,
    description: host.description,
    hostNature: host.hostNature,
    defaultTags: host.defaultTags.concat([host.name]),
    long: host.long,
    lat: host.lat,
    hostCoordinates: {
      type: 'Point',
      coordinates: [host.long, host.lat]
    },
    street: host.street,
    barangay: host.barangay,
    city: host.city,
    region: host.region,
    country: host.country,
    zip: host.zip,
    profilePic: host.profilePic
  });
  return newHost.save();
};

HostSchema.statics.findPaginated = function (query = {}, page = null, limit = null) {
  const allowedLimit = limit < 31 ? limit : 30;
  const offset = page * allowedLimit;
  if (limit) {
    return Host.find(query).skip(offset).limit(allowedLimit).sort('-createdAt');
  } else {
    return Host.find(query).sort('-createdAt');
  }
};

HostSchema.statics.search = function (searchString) {
  return Host.find({
    $or: [
      { name: { $regex: searchString, $options: 'i' } },
      { location: { $regex: searchString, $options: 'i' } },
      { hostNature: { $regex: searchString, $options: 'i' } }
    ]
  });
};

const Host = mongoose.model('Host', HostSchema);

module.exports = Host;

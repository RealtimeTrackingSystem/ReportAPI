const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const HostSchema = new Schema({
  name: { type: String, unique: false, required: true, index: true  },
  email: { type: String, unique: true, required: true, index: true   },
  location: { type: String, index: true  },
  description: { type: String, index: true  },
  hostNature: { type: String, index: true  },
  defaultTags: [{ type: String, index: true  }],
  long: { type: Number, index: true  },
  lat: { type: Number, index: true  },
  hostCoordinates: {
    type: {type: String, enum: 'Point', default: 'Point', index: true },
    coordinates: { type: [Number], default: [0, 0], index: true }
  },
  street: { type: String, index: true  },
  barangay: { type: String, index: true  },
  city: { type: String, index: true  },
  region: { type: String, index: true  },
  country: { type: String, index: true  },
  zip: { type: String, index: true  },
  profilePicture: { type: Types.ObjectId, ref: 'Picture', index: true  },
  isApproved: { type: Boolean, index: true, default: false },
  _client: { type: Types.ObjectId, ref: 'Client', index: true, required: true }
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
    profilePicture: host.profilePicture,
    category: host.category,
    _client: host._client
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
    profilePicture: host.profilePicture,
    category: host.category,
    _client: host._client
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
      { email: { $regex: searchString, $options: 'i' } },
      { location: { $regex: searchString, $options: 'i' } },
      { hostNature: { $regex: searchString, $options: 'i' } },
      { description: { $regex: searchString, $options: 'i' } },
      { street: { $regex: searchString, $options: 'i' } },
      { street: { $regex: searchString, $options: 'i' } },
      { street: { $regex: searchString, $options: 'i' } },
      { street: { $regex: searchString, $options: 'i' } },
      { street: { $regex: searchString, $options: 'i' } }
    ]
  });
};

HostSchema.statics.searchPaginated = async (searchString, page = 0, limit = 30) => {
  try {
    const query = {
      $or: [
        { name: { $regex: searchString, $options: 'i' } },
        { email: { $regex: searchString, $options: 'i' } },
        { location: { $regex: searchString, $options: 'i' } },
        { hostNature: { $regex: searchString, $options: 'i' } },
        { description: { $regex: searchString, $options: 'i' } },
        { street: { $regex: searchString, $options: 'i' } },
        { street: { $regex: searchString, $options: 'i' } },
        { street: { $regex: searchString, $options: 'i' } },
        { street: { $regex: searchString, $options: 'i' } },
        { street: { $regex: searchString, $options: 'i' } }
      ]
    };
    const offset = Number(page) * Number(limit);
    const count = await Host.count(query);
    const hosts = await Host.find(query).skip(offset).limit(Number(limit));
    return { count: count, hosts: hosts };
  }
  catch (e) {
    throw e;
  }
};

HostSchema.statics.approve = function (hostId) {
  return Host.findByIdAndUpdate(hostId, {
    isApproved: true
  });
};

const Host = mongoose.model('Host', HostSchema);

module.exports = Host;

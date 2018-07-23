import mongoose from 'mongoose';
const { Schema } = mongoose;
const { Types } = Schema;

const HostSchema = new Schema({
  email: { type: String },
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
  country: { type: String }
}, { timestamps: true })

const Host = mongoose.model('Host', HostSchema);

export default Host;

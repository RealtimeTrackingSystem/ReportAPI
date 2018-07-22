import mongoose from 'mongoose';
const { Schema } = mongoose;
const { Types } = Schema;

const OrganizationSchema = new Schema({
  name: { type: String },
  email: { type: String },
  website: { type: String },
  baranggay: { type: String },
  city: { type: String },
  region: { type: String },
  country: { type: String },
  description: { type: String },
  orgNature: { type: String }
}, { timestamps: true });

const Organization = mongoose.model('Organization', OrganizationSchema);

export default Organization;

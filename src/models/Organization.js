const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrganizationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true },
  website: { type: String, required: false },
  street: { type: String, required: true},
  barangay: { type: String, required: true},
  city: { type: String, required: true },
  region: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, default: 'philippines' },
  description: { type: String, required: true },
  orgNature: { type: String, required: true }
}, { timestamps: true });

OrganizationSchema.statics.add = function (organization) {
  const newOrg = new Organization({
    name: organization.name,
    email: organization.email,
    website: organization.website,
    barangay: organization.barangay,
    city: organization.city,
    region: organization.region,
    country: organization.country,
    zip: organization.zip,
    description: organization.description,
    orgNature: organization.orgNature
  });
  return newOrg.save();
};

OrganizationSchema.statics.findWithNameOrEmail = function (name, email) {
  return this.model('Organization').findOne({
    $or: [
      {name}, {email}
    ]
  });
};

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;

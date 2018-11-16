const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrganizationSchema = new Schema({
  name: { type: String, required: true, unique: true, index: true  },
  email: { type: String, unique: true, required: true, index: true  },
  website: { type: String, required: false, index: true  },
  street: { type: String, required: true, index: true },
  barangay: { type: String, required: true, index: true },
  city: { type: String, required: true, index: true  },
  region: { type: String, required: true, index: true  },
  zip: { type: String, required: true, index: true  },
  country: { type: String, default: 'philippines', index: true  },
  description: { type: String, required: true, index: true  },
  orgNature: { type: String, required: true, index: true  }
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

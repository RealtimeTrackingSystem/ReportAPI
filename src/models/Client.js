const mongoose = require('mongoose');
const lib = require('../lib');
const { Schema } = mongoose;
const { Types } = Schema;
const { crypto } = lib;

const ClientSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true  },
  subscriptionType: { type: String, enum: ['FREE', 'PAID'], default: 'FREE', index: true  },
  _organization: { type: Types.ObjectId, ref: 'Organization', index: true  },
  password: { type: String, index: true  },
  apiKey: { type: String, index: true  }
}, { timestamps: true });

ClientSchema.statics.add = function (client) {
  const { email, _organization, password } = client;
  const apiKey = crypto.codeGenerator('*+#+', 20);
  return crypto.hashAndSalt(password)
    .then(function (hashedPassword) {
      const newClient = new Client({
        email: email,
        password: hashedPassword,
        _organization: _organization,
        apiKey: apiKey.join('')
      });
      return newClient.save();
    });
};

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;

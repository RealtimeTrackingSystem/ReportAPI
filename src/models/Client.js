import mongoose from 'mongoose';
import lib from '../lib';
const { Schema } = mongoose;
const { Types } = Schema;
const { crypto } = lib;

const ClientSchema = new Schema({
  email: { type: String, required: true, unique: true },
  subscriptionType: { type: String, enum: ['FREE', 'PAID'], default: 'FREE' },
  _organization: { type: Types.ObjectId, ref: 'Organization' },
  password: { type: String },
  apiKey: { type: String }
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

export default Client;

import mongoose from 'mongoose';
const { Schema } = mongoose;
const { Types } = Schema;

const ClientSchema = new Schema({
  email: { type: String },
  _organization: { type: Types.ObjectId, ref: 'Organization' },
  password: { type: String },
  secretKey: { type: String },
  apiKey: { type: String }
}, { timestamps: true });

const Client = mongoose.model('Client', ClientSchema);

export default Client;

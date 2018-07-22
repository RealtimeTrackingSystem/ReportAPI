import mongoose from 'mongoose';
const { Schema } = mongoose;
const { Types } = Schema;

const PersonSchema = new Schema({
  _report: { type: Types.ObjectId, ref: 'Report' },
  fname: { type: String },
  lname: { type: String },
  alias: { type: String },
  isCulprit: { type: Boolean, default: false },
  isCasualty: { type: Boolean, default: true }
}, { timestamps: true })

const Person = mongoose.model('Person', PersonSchema);

export default Person;

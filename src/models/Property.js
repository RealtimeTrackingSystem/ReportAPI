const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const PropertySchema = new Schema({
  _report: { type: Types.ObjectId, ref: 'Report', required: true, index: true  },
  type: { type: String, required: true, index: true  },
  owner: { type: String, index: true  },
  description: { type: String, index: true  },
  estimatedCost: { type: Number, index: true  }
}, { timestamps: true });

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;

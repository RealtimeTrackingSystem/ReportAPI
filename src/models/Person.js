const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const PersonSchema = new Schema({
  _report: { type: Types.ObjectId, ref: 'Report', required: true, index: true  },
  fname: { type: String, index: true  },
  lname: { type: String, index: true  },
  alias: { type: String, required: true, index: true  },
  isCulprit: { type: Boolean, default: false, index: true  },
  isCasualty: { type: Boolean, default: true, index: true  },
  summons: [{
    type: Types.ObjectId, ref: 'Summon', index: true
  }],
  _clearance: {
    type: Types.ObjectId, ref: 'Clearance', index: true
  }
}, { timestamps: true });

PersonSchema.statics.add = function (person) {
  const newPerson = new Person({
    _report: person._report,
    fname: person.fname,
    lname: person.lname,
    alias: person.alias,
    isCulprit: person.isCulprit,
    isCasualty: person.isCasualty
  });
  return newPerson.save();
};

PersonSchema.statics.hydrate = function (person) {
  return new Person({
    _report: person._report,
    fname: person.fname,
    lname: person.lname,
    alias: person.alias,
    isCulprit: person.isCulprit,
    isCasualty: person.isCasualty
  });
};

PersonSchema.statics.addMany = function (people) {
  const peopleToInsert = people.map(function (person) {
    return new Person({
      _report: person._report,
      fname: person.fname,
      lname: person.lname,
      alias: person.alias,
      isCulprit: person.isCulprit,
      isCasualty: person.isCasualty
    });
  });
  return Person.insertMany(peopleToInsert);
};

PersonSchema.statics.findPaginated = async function (searchString = null, page = null, limit = null, options = {}) {
  try {
    const isCulprit = options.isCulprit;
    let where = {}

    if (searchString) {
      where = {
        $and: [
          {
            $or: [
              { fname: { $regex: searchString, $options: 'i' } },
              { lname: { $regex: searchString, $options: 'i' } },
              { alias: { $regex: searchString, $options: 'i' } }
            ]
          }
        ]
      };
    }

    if (isCulprit == 'true') {
      if (!where.$and) where.$and = [];
      where.$and.push({ isCulprit: true });
    }

    if (isCulprit == 'false') {
      if (!where.$and) where.$and = [];
      where.$and.push({ isCulprit: false });
    }
    const peopleQuery = Person.find(where).populate('_report');
    if (limit) {
      const offset = Number(limit) * Number(page) || 0;
      peopleQuery.skip(offset).limit(Number(limit));
    }

    const people = await peopleQuery;
    const count = await Person.countDocuments(where);
    return {
      people, count
    };
  } catch (e) {
    throw e;
  }
};

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;

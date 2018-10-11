const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const PersonSchema = new Schema({
  _report: { type: Types.ObjectId, ref: 'Report', required: true },
  fname: { type: String },
  lname: { type: String },
  alias: { type: String, required: true },
  isCulprit: { type: Boolean, default: false },
  isCasualty: { type: Boolean, default: true }
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

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;

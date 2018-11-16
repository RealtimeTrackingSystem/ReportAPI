const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

const CategorySchema = new Schema({
  name: { type: String, unique: true, required: true , index: true },
  description: { type: String, index: true  }
}, { timestamps: true });

CategorySchema.statics.search = function (searchString) {
  return Category.find({
    $or: [
      { name: { $regex: searchString, $options: 'i' } }
    ]
  });
};

CategorySchema.statics.hydrate = function (category) {
  return new Category({
    name: category.name.toLowerCase(),
    description: category.description
  });
};

CategorySchema.statics.add = function (category) {
  const newCategory = new Category({
    name: category.name.toLowerCase(),
    description: category.description
  });
  return newCategory.save();
};

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;

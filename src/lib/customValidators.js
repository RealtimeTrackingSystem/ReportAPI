const mongoose = require('mongoose');

function equalPasswords (params) {
  return params.password === params.passwordConfirmation;
}

function validateWithFunction (params, functionReturn) {
  return functionReturn(params);
}

function isObjectId (value) {
  try {
    const {
      ObjectId
    } = mongoose.Types;
    const asString = value.toString(); // value is either ObjectId or string or anything
    const asObjectId = new ObjectId(asString);
    const asStringifiedObjectId = asObjectId.toString();
    return asString === asStringifiedObjectId;
  } catch (error) {
    return false;
  }
}

module.exports = {
  equalPasswords,
  validateWithFunction,
  isObjectId
};

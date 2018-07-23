function equalPasswords (params) {
  return params.password === params.passwordConfirmation;
}

function validateWithFunction (params, functionReturn) {
  return functionReturn(params);
}

module.exports = {
  equalPasswords,
  validateWithFunction
};

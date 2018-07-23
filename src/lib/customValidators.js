import app from '../index';

function equalPasswords (params) {
  return params.password === params.passwordConfirmation;
}

function validateWithFunction (params, functionReturn) {
  return functionReturn(params);
}

export default {
  equalPasswords,
  validateWithFunction
};

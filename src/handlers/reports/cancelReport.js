const lib = require('../../lib');

function setBody (req, res, next) {
  req.body.status = 'VOID';
  next();
}

module.exports = {
  setBody
};

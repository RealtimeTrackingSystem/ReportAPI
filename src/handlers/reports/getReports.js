
function validateQuery (req, res, next) {

}

function logic (req, res) {
  const limit = parseInt(req.query.limit) || 30;
  const page = parseInt(req.query.page) || 0;
  return req.DB.Report.findPaginated({}, page, limit)
    .then(function (reports) {
      res.status(200).send({
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 200,
        reports: reports
      });
    });
}

module.exports = {
  validateQuery,
  logic
};

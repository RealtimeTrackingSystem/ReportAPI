function logic (req, res) {
  return req.DB.Report.find({})
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
  logic
};

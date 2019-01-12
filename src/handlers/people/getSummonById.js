function logic (req, res) {
  const summonId = req.params.summonId;
  return req.DB.Summon.findOne({ _id: summonId })
    .populate('_person')
    .then(summon => {
      res.status(200).send({
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 200,
        summon: summon
      });
    })
    .catch(e => {
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

module.exports = {
  logic
};
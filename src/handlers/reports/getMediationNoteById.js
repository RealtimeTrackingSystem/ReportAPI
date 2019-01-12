function logic (req, res) {
  const mediationNoteId = req.params.mediationNoteId;
  return req.DB.MediationNote.findOne({
    _id: mediationNoteId
  })
    .populate('_media')
    .populate('_reporter')
    .then((mediationNote) => {
      res.status(200).send({
        status: 'SUCCESS',
        statusCode: 0,
        httpCode: 200,
        mediationNote: mediationNote
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

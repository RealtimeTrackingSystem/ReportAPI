
function routes (app) {
  app.get('/echo', function (req, res) {
    res.status(200).send({
      status: 'SUCCESS',
      statusCode: 0,
      httpCode: 200,
      message: 'REPORT API is online!'
    });
  });
  app.use(require('./report.route'));
  app.use('*', function (req, res){
    const path = req.params['0'];
    const message = `${path} is not a valid path`;
    res.status(404).send({
      status: 'ERROR',
      statusCode: 4,
      httpCode: 404,
      message: message
    });
  });
}

export default routes;

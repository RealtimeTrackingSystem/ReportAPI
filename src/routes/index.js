
function routes (app) {
  app.get('/echo', function (req, res) {
    const success = {
      status: 'SUCCESS',
      statusCode: 0,
      httpCode: 200,
      message: 'REPORT API is online!'
    };
    req.logger.info('GET /echo', success);
    res.status(200).send(success);
  });
  app.use(require('./report.route'));
  app.use(require('./client.route'));
  app.use('*', function (req, res){
    const path = req.params['0'];
    const message = `${path} is not a valid path`;
    const error = {
      status: 'ERROR',
      statusCode: 4,
      httpCode: 404,
      message: message
    };
    req.logger.warn(path, error);
    res.status(404).send(error);
  });
}

export default routes;


function validateResources (req, res, next) {
  // populate specified resources
  const ALLOWED_RESOURCES = ['reporter', 'host', 'people', 'properties', 'medias'];
  const resources
    = req.query.resources
      ? req.query.resources
        .split(',')
        .reduce(function (p, c) {
          if (ALLOWED_RESOURCES.indexOf(c) > -1) {
            return p.concat([c]);
          }
          return p;
        }, [])
      : [];
  req.$scope.resources = resources;
  next();
}

function queryBuilder (req, res, next) {
  const reportId = req.params.reportId;
  const resources = req.$scope.resources;
  const ReportQuery = req.DB.Report.findById(reportId);

  if (resources.indexOf('reporter') > -1) {
    ReportQuery.populate('_reporter');
  }

  if (resources.indexOf('host') > -1) {
    ReportQuery.populate('_host');
  }

  if (resources.indexOf('people') > -1) {
    ReportQuery.populate({
      path: 'people',
      model: 'Person',
      populate: {
        path: 'summons',
        model: 'Summon'
      }
    });
  }

  if (resources.indexOf('properties') > -1) {
    ReportQuery.populate('properties');
  }

  if (resources.indexOf('medias') > -1) {
    ReportQuery.populate('medias');
  }

  ReportQuery.populate('_category');
  ReportQuery.populate('notes');
  ReportQuery.populate('duplicates');
  ReportQuery.populate('duplicateParent');

  ReportQuery.populate({
    path: 'mediationNotes',
    model: 'MediationNote',
    populate: {
      path: '_media',
      model: 'Attachment'
    }
  });

  ReportQuery.populate('_fileAction');

  req.$scope.ReportQuery = ReportQuery;
  next();
}

function logic (req, res, next) {
  return req.$scope.ReportQuery
    .then(function (report) {
      req.$scope.report = report;
      next();
    })
    .catch(function (err) {
      if (err.httpCode) {
        return res.status(err.httpCode).send(err);
      }
      // req.logger.error(err, 'PUT /api/reports/:reportId');
      res.status(500).send({
        status: 'ERROR',
        statusCode: 1,
        httpCode: 500,
        message: 'Internal Server Error'
      });
    });
}

function respond (req, res) {
  // req.logger.info(req.$scope.report, 'PUT /api/reports/:reportId');
  res.status(200).send({
    status: 'SUCCESS',
    statusCode: 0,
    httpCode: 200,
    report: req.$scope.report
  });
}

module.exports = {
  validateResources,
  queryBuilder,
  logic,
  respond
};

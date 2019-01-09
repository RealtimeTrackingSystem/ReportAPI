
module.exports = {
  getReports: require('./getReports'),
  getReportById: require('./getReportsById'),
  createReport: require('./createReport'),
  putReportStatus: require('./putReportStatus'),
  cancelReport: require('./cancelReport'),
  searchReports: require('./searchReports'),
  postDuplicate: require('./postDuplicate'),
  massStatusUpdate: require('./massStatusUpdate'),
  getDuplicateReports: require('./getDuplicateReports'),
  postDuplicateReport: require('./postDuplicateReport'),
  putRemoveDuplicateReport: require('./putRemoveDuplicateReport')
};

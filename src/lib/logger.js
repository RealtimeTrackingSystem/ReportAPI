import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'Report - API'
});

export default logger;

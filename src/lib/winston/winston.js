import winston from 'winston';

const myCustomLevels = {
  colors: {
    info: 'blue',
    verbose: 'green',
    warn: 'yellow',
    error: 'red'
  }
};

winston.addColors(myCustomLevels.colors);

winston.format.combine(
  winston.format.colorize(myCustomLevels.colors),
  winston.format.json()
);

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

export default logger;

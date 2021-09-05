const winston = require('winston');
const logger = winston.createLogger({
  level: "error",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error'
    })
  ],
});

logger.stream = {
  write: (message) => {
    logger.info(message.length > 0 ? message.substring(0, message.length - 1) : message);
  },
};

module.exports = logger;

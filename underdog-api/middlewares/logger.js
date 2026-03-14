const path = require('path');
const fs = require('fs');
const expressWinston = require('express-winston');
const winston = require('winston');

const logsDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const requestLogPath = path.join(logsDir, 'request.log');
const errorLogPath = path.join(logsDir, 'error.log');

const requestTransports = [
  new winston.transports.File({ filename: requestLogPath }),
];

const errorTransports = [
  new winston.transports.File({ filename: errorLogPath }),
];

if (process.env.NODE_ENV !== 'production') {
  requestTransports.push(new winston.transports.Console());
  errorTransports.push(new winston.transports.Console());
}

const requestLogger = expressWinston.logger({
  transports: requestTransports,
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: errorTransports,
  format: winston.format.json(),
});

module.exports = { requestLogger, errorLogger };

const { STATUS_SERVER_ERROR, MSG_SERVER_ERROR } = require('../utils/constants');

module.exports = (err, req, res) => {
  const { statusCode = STATUS_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === STATUS_SERVER_ERROR
        ? MSG_SERVER_ERROR
        : message,
  });
};
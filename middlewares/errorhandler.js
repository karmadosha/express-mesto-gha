const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;
  if (!statusCode) {
    return res.status(statusCode).send({
      message: statusCode === 500 ? 'Ошибка сервера' : message,
    });
  }
  res.status(statusCode).send({ message: err.message });

  return next();
};

module.exports = errorHandler;

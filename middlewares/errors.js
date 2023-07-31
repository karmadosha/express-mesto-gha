const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;
  if (!err.statusCode) {
    res.status(statusCode).send({
      message: statusCode === 500 ? 'Ошибка сервера' : message,
    });
  }
  res.status(err.statusCode).send({ message: err.message });

  next();
};

module.exports = errorHandler;

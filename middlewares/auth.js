const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../utils/errors/err-unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new ErrorUnauthorized('Необходимо авторизоваться');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new ErrorUnauthorized('Необходимо авторизоваться');
  }

  req.user = payload;
  next();
};

module.exports = auth;

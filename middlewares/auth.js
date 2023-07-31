const jwt = require('jsonwebtoken');
const ERROR_AUTH = require('../utils/errors/errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new ERROR_AUTH('Необходимо авторизоваться'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new ERROR_AUTH('Необходимо авторизоваться'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;

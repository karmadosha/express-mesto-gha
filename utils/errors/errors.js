const ERROR_INCORRECT_DATA = require('./err-bad-request');
const ERROR_AUTH = require('./err-unauthorized');
const ERROR_FORBIDDEN = require('./err-forbidden');
const ERROR_NOT_FOUND = require('./err-not-found');
const ERROR_NOTUNIQUE = require('./err-not-unique');
const ERROR_DEFAULT = require('./err-internal-server');

module.exports = {
  ERROR_NOT_FOUND,
  ERROR_INCORRECT_DATA,
  ERROR_AUTH,
  ERROR_FORBIDDEN,
  ERROR_NOTUNIQUE,
  ERROR_DEFAULT,
};

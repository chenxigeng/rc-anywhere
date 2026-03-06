const logger = require('koa-logger');

module.exports = function createLoggerMiddleware() {
  return logger();
};

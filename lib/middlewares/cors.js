const cors = require('@koa/cors');

module.exports = function createCorsMiddleware(options) {
  if (!options.cors) return null;
  return cors();
};

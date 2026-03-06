const serve = require('koa-static');
const mount = require('koa-mount');

module.exports = function createStaticMiddleware(options) {
  return mount('/', serve(options.directory));
};

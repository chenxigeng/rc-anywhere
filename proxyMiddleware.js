const { createProxyMiddleware } = require('http-proxy-middleware');
const c2k = require('koa-connect');

/**
 * 创建代理中间件
 * @param {Object} proxyOptions 代理配置对象
 * @returns {Array<Function>} Koa中间件数组
 */
function createProxyMiddlewares(proxyOptions) {
  const middlewares = [];
  
  Object.keys(proxyOptions).forEach(context => {
    const options = proxyOptions[context];
    const proxyMiddleware = c2k(createProxyMiddleware(options));
    middlewares.push(async (ctx, next) => {
      if (ctx.path.startsWith(context)) {
        await proxyMiddleware(ctx, next);
      } else {
        await next();
      }
    });
  });
  
  return middlewares;
}

module.exports = createProxyMiddlewares; 
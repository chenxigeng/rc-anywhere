const { createProxyMiddleware } = require('http-proxy-middleware');
const c2k = require('koa-connect');
const chalk = require('chalk');

/**
 * 创建代理中间件
 * @param {Object} proxyConfig 代理配置对象
 * @returns {Array<Function>} Koa中间件函数数组
 */
function createProxyMiddlewares(proxyConfig) {
  const middlewares = [];
  
  if (Object.keys(proxyConfig).length > 0) {
    console.log(chalk.green('启用代理配置:'));
    Object.keys(proxyConfig).forEach(context => {
      console.log(chalk.yellow(`  ${context} -> ${proxyConfig[context].target}`));
    });
  }

  Object.keys(proxyConfig).forEach(context => {
    const options = proxyConfig[context];
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

module.exports = {
  createProxyMiddlewares
};

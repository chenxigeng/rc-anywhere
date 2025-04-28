const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const c2k = require('koa-connect');
const chalk = require('chalk');
const os = require('os');

/**
 * Get ip(v4) address
 * @return {String} the ipv4 address or 'localhost'
 */
const getIPAddress = function () {
  var ifaces = os.networkInterfaces();
  var ipList = [];
  for (var dev in ifaces) {
    ifaces[dev].forEach(function (details) {
      if (details.family === 'IPv4' && !details.internal) {
        ipList.push(details.address);
      }
    });
  }
  // Local IP first
  ipList.sort(function (ip1, ip2) {
    if(ip1.indexOf('192') >= 0){
      return -1;
    }
    return 1;
  });
  return ipList[0] || "127.0.0.1";
}

/**
 * 创建代理中间件
 * @param {Object} proxyOptions 代理配置对象
 * @returns {Array<Function>} Koa中间件函数数组
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

/**
 * 启动服务器
 * @param {Object} options 服务器选项
 * @param {number} options.port 端口号
 * @param {string} options.directory 静态文件目录
 * @param {Object} options.proxyConfig 代理配置
 * @param {String} options.host host
 * @returns {Object} Koa服务器实例
 */
function start(options) {
  const { port = 3000, directory = process.cwd(), proxyConfig = {}, host = getIPAddress() } = options;
  
  const app = new Koa();
  
  // 静态文件服务配置
  app.use(mount('/', serve(directory)));
  
  console.log('添加代理中间件', proxyConfig)
  // 添加代理中间件
  if (Object.keys(proxyConfig).length > 0) {
    console.log(chalk.green('启用代理配置:'));
    Object.keys(proxyConfig).forEach(context => {
      console.log(chalk.yellow(`  ${context} -> ${proxyConfig[context].target}`));
    });
    
    const proxyMiddlewares = createProxyMiddlewares(proxyConfig);
    proxyMiddlewares.forEach(middleware => {
      app.use(middleware);
    });
  }
  
  // 对于单页应用，将所有不匹配的路由重定向到index.html
  app.use(async (ctx) => {
    const indexHtml = path.join(directory, 'index.html');
    if (ctx.status === 404 && require('fs').existsSync(indexHtml)) {
      ctx.type = 'html';
      ctx.body = require('fs').createReadStream(indexHtml);
    }
  });
  
  app.listen(port, () => {
    console.log(chalk.green(`服务器运行在 http://${host}:${port}`));
    console.log(chalk.blue(`静态文件目录: ${directory}`));
  });
  
  return app;
}

module.exports = {
  start
}; 
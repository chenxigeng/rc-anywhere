const Koa = require('koa');
const chalk = require('chalk');
const { getIPAddress, openBrowser, printQRCode, getAvailablePort } = require('./utils');

const createLoggerMiddleware = require('./middlewares/logger');
const createCompressMiddleware = require('./middlewares/compress');
const createCorsMiddleware = require('./middlewares/cors');
const getProxyMiddlewares = require('./middlewares/proxy');
const createStaticMiddleware = require('./middlewares/static');
const createFallbackMiddleware = require('./middlewares/fallback');

/**
 * 启动服务器
 * @param {Object} options 服务器选项
 * @param {number} options.port 端口号
 * @param {string} options.directory 静态文件目录
 * @param {Object} options.proxyConfig 代理配置
 * @param {String} options.host host
 * @param {boolean} options.open 是否自动打开浏览器
 * @param {boolean} options.cors 是否允许跨域
 * @param {boolean} options.gzip 是否启用 Gzip 压缩
 * @returns {Object} Koa服务器实例
 */
async function start(options) {
  const { 
    port = 3000, 
    directory = process.cwd(), 
    proxyConfig = {}, 
    host = getIPAddress(),
    open = false,
    cors = false,
    gzip = true
  } = options;
  
  // 构建统一配置以供中间件使用
  const config = { port, directory, proxyConfig, host, open, cors, gzip };

  const app = new Koa();
  const actualPort = await getAvailablePort(parseInt(config.port, 10));

  // 定义中间件流水线 (Pipeline)
  const pipeline = [
    createLoggerMiddleware(config),
    createCompressMiddleware(config),
    createCorsMiddleware(config),
    ...getProxyMiddlewares(config),
    createStaticMiddleware(config),
    createFallbackMiddleware(config)
  ];

  // 顺序挂载中间件
  pipeline.forEach(middleware => {
    if (middleware) {
      app.use(middleware);
    }
  });
  
  app.listen(actualPort, () => {
    const ip = getIPAddress();
    const localUrl = `http://localhost:${actualPort}`;
    const networkUrl = `http://${ip}:${actualPort}`;

    console.log(chalk.green(`\n服务器启动成功!`));
    if (actualPort !== parseInt(config.port, 10)) {
      console.log(chalk.yellow(`(⚠️ 端口 ${config.port} 被占用, 已自动切换为 ${actualPort})`));
    }
    console.log(`- Local:   ${chalk.cyan(localUrl)}`);
    console.log(`- Network: ${chalk.cyan(networkUrl)}`);
    console.log(chalk.blue(`- Root:    ${config.directory}`));
    
    if (config.cors) console.log(chalk.yellow('- CORS:    Enabled'));
    if (config.gzip) console.log(chalk.yellow('- Gzip:    Enabled'));

    // 打印二维码
    console.log(chalk.gray('\n扫描二维码访问 (Network):'));
    printQRCode(networkUrl);

    if (config.open) {
      openBrowser(localUrl);
    }
  });
  
  return app;
}

module.exports = {
  start
};

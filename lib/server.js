const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const compress = require('koa-compress');
const { getIPAddress, openBrowser, printQRCode } = require('./utils');
const { createProxyMiddlewares } = require('./proxy');
const { generateDirectoryListing } = require('./directory');

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
function start(options) {
  const { 
    port = 3000, 
    directory = process.cwd(), 
    proxyConfig = {}, 
    host = getIPAddress(),
    open = false,
    cors: enableCors = false,
    gzip = true
  } = options;
  
  const app = new Koa();

  // 日志中间件
  app.use(logger());

  // Gzip 压缩
  if (gzip) {
    app.use(compress({
      threshold: 2048,
      gzip: {
        flush: require('zlib').constants.Z_SYNC_FLUSH
      },
      deflate: {
        flush: require('zlib').constants.Z_SYNC_FLUSH
      },
      br: false // 禁用 brotli，因为需要额外的二进制依赖，保持轻量
    }));
  }

  // CORS 中间件配置
  if (enableCors) {
    app.use(cors());
  }
  
  // 静态文件服务配置
  app.use(mount('/', serve(directory)));
  
  // 添加代理中间件
  if (Object.keys(proxyConfig).length > 0) {
    const proxyMiddlewares = createProxyMiddlewares(proxyConfig);
    proxyMiddlewares.forEach(middleware => {
      app.use(middleware);
    });
  }
  
  // 目录列表与 SPA 回退处理
  app.use(async (ctx) => {
    // 如果之前的中间件没有处理请求（即文件未找到），进入此中间件
    if (ctx.status === 404) {
      const requestPath = ctx.path;
      const fullPath = path.join(directory, requestPath);
      
      // 检查是否为目录
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        // 如果是目录，且没有 index.html (koa-static 会处理有 index.html 的情况)，则显示目录列表
        ctx.type = 'html';
        ctx.body = generateDirectoryListing(fullPath, requestPath);
        return;
      }

      // 如果不是目录，或者是目录但这里是 404 处理逻辑的一部分
      // 尝试 SPA 回退逻辑：检查根目录下的 index.html
      const indexHtml = path.join(directory, 'index.html');
      if (fs.existsSync(indexHtml)) {
        ctx.type = 'html';
        ctx.body = fs.createReadStream(indexHtml);
      }
    }
  });
  
  app.listen(port, () => {
    const ip = getIPAddress();
    const localUrl = `http://localhost:${port}`;
    const networkUrl = `http://${ip}:${port}`;

    console.log(chalk.green(`\n服务器启动成功!`));
    console.log(`- Local:   ${chalk.cyan(localUrl)}`);
    console.log(`- Network: ${chalk.cyan(networkUrl)}`);
    console.log(chalk.blue(`- Root:    ${directory}`));
    
    if (enableCors) console.log(chalk.yellow('- CORS:    Enabled'));
    if (gzip) console.log(chalk.yellow('- Gzip:    Enabled'));

    // 打印二维码
    console.log(chalk.gray('\n扫描二维码访问 (Network):'));
    printQRCode(networkUrl);

    if (open) {
      openBrowser(localUrl);
    }
  });
  
  return app;
}

module.exports = {
  start
};

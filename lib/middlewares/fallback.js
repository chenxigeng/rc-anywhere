const fs = require('fs');
const path = require('path');
const { generateDirectoryListing } = require('../directory');

module.exports = function createFallbackMiddleware(options) {
  const directory = options.directory;
  
  return async (ctx, next) => {
    // 等待前面的中间件执行完
    await next();
    
    // 如果之前的中间件没有处理请求（即文件未找到），进入此逻辑
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
  };
};

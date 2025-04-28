const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const path = require('path');
const proxyOptions = require('./proxyConfig');
const createProxyMiddlewares = require('./proxyMiddleware');

const app = new Koa();

// 静态文件服务配置
app.use(mount('/', serve(path.join(__dirname, 'dist'))));

// 添加代理中间件
const proxyMiddlewares = createProxyMiddlewares(proxyOptions);
proxyMiddlewares.forEach(middleware => {
  app.use(middleware);
});

// 对于单页应用，将所有不匹配的路由重定向到index.html
app.use(async (ctx) => {
  if (ctx.status === 404) {
    ctx.type = 'html';
    ctx.body = require('fs').createReadStream(path.join(__dirname, 'dist', 'index.html'));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
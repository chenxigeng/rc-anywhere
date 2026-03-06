const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { getIPAddress, printQRCode, getAvailablePort } = require('./utils');

/**
 * 启动 Mock 服务器
 * @param {Object} options
 * @param {number} options.port 端口号
 * @param {string} options.file 数据文件路径
 * @param {string} options.host host
 */
async function start(options) {
  const {
    port = 3000,
    host = getIPAddress(),
    file = 'db.json',
    watch = false,
    delay = 0,
    readOnly = false,
    noCors = false,
    quiet = false
  } = options;

  const actualPort = await getAvailablePort(parseInt(port, 10));

  const server = jsonServer.create();
  const dbPath = path.resolve(process.cwd(), file);

  // 检查并创建默认数据文件
  if (!fs.existsSync(dbPath)) {
    if (file === 'db.json') {
      if (!quiet) console.log(chalk.yellow(`数据文件 ${file} 不存在，正在创建示例文件...`));
      const exampleData = {
        posts: [
          { id: 1, title: 'json-server', author: 'typicode' }
        ],
        comments: [
          { id: 1, body: 'some comment', postId: 1 }
        ],
        profile: { name: 'typicode' }
      };
      fs.writeFileSync(dbPath, JSON.stringify(exampleData, null, 2));
      if (!quiet) console.log(chalk.green(`已创建示例数据文件: ${dbPath}`));
    } else {
      console.error(chalk.red(`错误: 数据文件 ${file} 不存在`));
      process.exit(1);
    }
  }

  // 监听文件变化配置 router
  // 注: jsonServer.router 内部支持传入文件名，如果不传文件内容，修改不会同步，所以直接传文件路径更好。
  const router = jsonServer.router(dbPath);
  
  // 设置默认中间件
  const middlewares = jsonServer.defaults({
    noCors: noCors,
    readOnly: readOnly,
    logger: !quiet // 如果 quiet 为 true，则关闭默认 logger
  });

  server.use(middlewares);

  // 自定义延迟中间件
  if (delay > 0) {
    server.use((req, res, next) => {
      setTimeout(next, delay);
    });
  }
  
  // 必须把 body parser 放在 router 之前， json-server defaults 中包含 bodyParser，如果没有，自行添加
  server.use(jsonServer.bodyParser);

  // 使用 router
  server.use(router);

  server.listen(actualPort, () => {
    if (quiet) return;
    
    const ip = getIPAddress();
    const localUrl = `http://${host === '0.0.0.0' ? 'localhost' : host}:${actualPort}`;
    const networkUrl = `http://${ip}:${actualPort}`;

    console.log(chalk.green(`\nMock Server 启动成功!`));
    if (actualPort !== parseInt(port, 10)) {
      console.log(chalk.yellow(`(⚠️ 端口 ${port} 被占用, 已自动切换为 ${actualPort})`));
    }
    console.log(`- Local:   ${chalk.cyan(localUrl)}`);
    console.log(`- Network: ${chalk.cyan(networkUrl)}`);
    console.log(chalk.blue(`- File:    ${file}`));
    if (delay) console.log(chalk.yellow(`- Delay:   ${delay}ms`));
    if (readOnly) console.log(chalk.yellow(`- ReadOnly:Enabled`));
    
    console.log(chalk.gray('\n扫描二维码访问 (Network):'));
    printQRCode(networkUrl);
    
    console.log(chalk.gray('\n资源列表:'));
    try {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      Object.keys(db).forEach(key => {
        console.log(chalk.gray(`  http://localhost:${actualPort}/${key}`));
      });
    } catch (e) {
      // 忽略 JSON 解析错误，可能文件正在被修改
    }
  });
}

module.exports = {
  start
};

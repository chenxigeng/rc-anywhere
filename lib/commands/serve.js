const server = require('../server');
const { loadConfig } = require('../config');

module.exports = {
  name: 'serve',
  description: '启动静态文件服务器',
  options: [
    { flags: '-h, --host <host>', description: '指定host', defaultValue: 'localhost' },
    { flags: '-p, --port <port>', description: '指定端口号', defaultValue: 3000 },
    { flags: '-d, --directory <path>', description: '指定静态文件目录', defaultValue: process.cwd() },
    { flags: '-c, --config <path>', description: '指定代理配置文件路径' },
    { flags: '-o, --open', description: '自动打开浏览器' },
    { flags: '--cors', description: '允许跨域请求' },
    { flags: '--no-gzip', description: '禁用 Gzip 压缩' }
  ],
  action: (options) => {
    // 使用统一的配置解析
    const config = loadConfig(options);

    // 启动服务器
    server.start(config);
  }
};

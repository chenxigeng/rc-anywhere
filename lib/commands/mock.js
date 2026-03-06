module.exports = {
  name: 'mock-server',
  description: '启动 Mock API 服务器 (兼容 json-server)',
  options: [
    { flags: '-p, --port <port>', description: '指定端口号', defaultValue: 3000 },
    { flags: '-H, --host <host>', description: '指定 host', defaultValue: 'localhost' },
    { flags: '-f, --file <file>', description: '指定数据文件', defaultValue: 'db.json' },
    { flags: '-w, --watch', description: '监听文件变化' },
    { flags: '-d, --delay <ms>', description: '增加响应延迟 (毫秒)' },
    { flags: '--read-only', description: '只允许 GET 请求' },
    { flags: '--no-cors', description: '禁用 CORS' },
    { flags: '-q, --quiet', description: '控制台静默模式' }
  ],
  action: (options) => {
    require('../mock-server').start(options);
  }
};

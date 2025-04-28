#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const path = require('path');
const fs = require('fs');
const server = require('../lib/server');

program
  .version(pkg.version)
  .option('-h, --host <host>', '指定host', 'localhost')
  .option('-p, --port <port>', '指定端口号', 3000)
  .option('-d, --directory <path>', '指定静态文件目录', process.cwd())
  .option('-c, --config <path>', '指定代理配置文件路径')
  .parse(process.argv);

const options = program.opts();

// 检查并加载代理配置
let proxyConfig = {};
if (options.config) {
  const configPath = path.resolve(process.cwd(), options.config);
  if (fs.existsSync(configPath)) {
    proxyConfig = require(configPath);
    console.log('检查并加载代理配置',configPath, proxyConfig)
  } else {
    console.error(`配置文件 ${options.config} 不存在`);
    process.exit(1);
  }
}

// 启动服务器
server.start({
  port: options.port,
  directory: options.directory,
  proxyConfig
}); 
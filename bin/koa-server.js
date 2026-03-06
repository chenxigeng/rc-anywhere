#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const server = require('../lib/server');

const TARGET_PATH = path.join(process.cwd(), 'proxyConfig.cjs');

// 创建serve子命令
program
  .command('serve')
  .description('启动静态文件服务器')
  .option('-h, --host <host>', '指定host', 'localhost')
  .option('-p, --port <port>', '指定端口号', 3000)
  .option('-d, --directory <path>', '指定静态文件目录', process.cwd())
  .option('-c, --config <path>', '指定代理配置文件路径')
  .option('-o, --open', '自动打开浏览器')
  .option('--cors', '允许跨域请求')
  .option('--no-gzip', '禁用 Gzip 压缩')
  .action((options) => {
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
    } else {
      if (fs.existsSync(TARGET_PATH)) {
        proxyConfig = require(TARGET_PATH);
      }
    }

    // 启动服务器
    server.start({
      port: options.port,
      directory: options.directory,
      proxyConfig,
      open: options.open,
      cors: options.cors,
      gzip: options.gzip
    });
  });

// 创建init子命令
program
  .command('init')
  .description('初始化代理配置')
  .action(() => {
    if (fs.existsSync(TARGET_PATH)) {
      console.log('代理配置文件已存在');
      return;
    }
    fs.copyFileSync(path.join(__dirname, '../proxyConfig.template.js'), TARGET_PATH);
    console.log('代理配置文件已初始化');
  });

// 创建mock-server子命令
program
  .command('mock-server')
  .description('启动 Mock API 服务器 (兼容 json-server)')
  .option('-p, --port <port>', '指定端口号', 3000)
  .option('-H, --host <host>', '指定 host', 'localhost')
  .option('-f, --file <file>', '指定数据文件', 'db.json')
  .option('-w, --watch', '监听文件变化')
  .option('-d, --delay <ms>', '增加响应延迟 (毫秒)')
  .option('--read-only', '只允许 GET 请求')
  .option('--no-cors', '禁用 CORS')
  .option('-q, --quiet', '控制台静默模式')
  .action((options) => {
    require('../lib/mock-server').start(options);
  });

program.version(pkg.version);
program.parse(process.argv);

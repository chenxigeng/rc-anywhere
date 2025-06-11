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
      proxyConfig
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

program.version(pkg.version);
program.parse(process.argv); 
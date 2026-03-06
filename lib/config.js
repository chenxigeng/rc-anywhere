const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

/**
 * 统一处理配置解析和合并
 * @param {Object} cliOptions 命令行传入的选项
 * @returns {Object} 最终合并的配置
 */
function loadConfig(cliOptions) {
  // 默认配置
  const defaultConfig = {
    port: 3000,
    host: 'localhost',
    directory: process.cwd(),
    open: false,
    cors: false,
    gzip: true,
    proxyConfig: {}
  };

  const config = { ...defaultConfig, ...cliOptions };

  // 检查并加载代理配置
  const TARGET_PATH = path.join(process.cwd(), 'proxyConfig.cjs');
  let proxyConfig = {};

  if (cliOptions.config) {
    const configPath = path.resolve(process.cwd(), cliOptions.config);
    if (fs.existsSync(configPath)) {
      proxyConfig = require(configPath);
      console.log('检查并加载代理配置', configPath, proxyConfig);
    } else {
      console.error(chalk.red(`配置文件 ${cliOptions.config} 不存在`));
      process.exit(1);
    }
  } else {
    if (fs.existsSync(TARGET_PATH)) {
      proxyConfig = require(TARGET_PATH);
    }
  }

  config.proxyConfig = proxyConfig;

  return config;
}

module.exports = {
  loadConfig
};

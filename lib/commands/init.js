const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

module.exports = {
  name: 'init',
  description: '初始化代理配置',
  action: () => {
    const TARGET_PATH = path.join(process.cwd(), 'proxyConfig.cjs');
    if (fs.existsSync(TARGET_PATH)) {
      console.log('代理配置文件已存在');
      return;
    }
    fs.copyFileSync(path.join(__dirname, '../../proxyConfig.template.js'), TARGET_PATH);
    console.log('代理配置文件已初始化');
  }
};

# rc-anywhere

前端项目打包本地自测神器，支持灵活的代理配置，适合本地开发和前端联调。

从开源库 anywhere 得到的启发，respect!!!

## 特性

- 支持对打包后项目进行本地自测，可访问跨域接口
- 多路由代理，支持 pathRewrite
- 单页应用 history fallback
- 命令行参数友好

## 安装

```bash
npm install -g rc-anywhere
```

## 快速开始

### 初始化代理配置

```bash

rc-anywhere init
```

这会在当前目录创建一个`proxyConfig.cjs`文件。
根据注释的提示，修改proxyConfig.js对应的代理配置信息

### 启动服务

```bash
rc-anywhere serve
```

直接使用 serve 命令启动，会使用默认配置参数

- port: 3000
- 查找当前目录下是否有proxyConfig.cjs，有则读取该配置

参数说明：

- `-p, --port`       端口号（默认 3000）
- `-c, --config`     代理配置文件路径（可选，默认读取当前目录的proxyConfig.cjs），这里也可自定义配置文件名，不过后缀必须为 .cjs

## 代理配置示例（proxyConfig.cjs）

```js
// 代理配置，更多配置请前往
// https://www.npmjs.com/package/http-proxy-middleware#pathrewrite-objectfunction
module.exports = {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    // pathRewrite: { '^/api': '' }
    // pathRewrite: path => path.replace(/^\/api/, '')
  },
  '/graphql': {
    target: 'http://localhost:4000',
    changeOrigin: true
  }
};
```

## 作为依赖使用

```js
const server = require('rc-anywhere');
server.start({
  port: 3000,
  directory: './dist',
  proxyConfig: require('./proxyConfig.cjs')
});
```

## 欢迎大家来提issue！

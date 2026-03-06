# rc-anywhere

前端项目本地自测神器！支持静态文件服务、API 代理转发、一键 Mock 服务等功能。适合前端项目打包后的本地预览、移动端调试以及与后端的联调工作。

> 💡 灵感来源于开源库 [anywhere](https://github.com/JacksonTian/anywhere)，并在此基础上增加了 Koa 生态的扩展、多路由代理以及强大的 Mock 功能。

## ✨ 特性

- 🚀 **开箱即用**：零配置启动本地静态文件服务器
- 🔄 **灵活代理**：支持多路由 API 代理，解决跨域及联调问题（基于 `http-proxy-middleware`）
- 🎭 **独立 Mock 服务**：内置全功能 REST API Mock 服务（基于 `json-server`）
- 📱 **移动端友好**：自动获取局域网 IP，启动即打印二维码，扫码即可手机预览
- 🛡️ **智能防冲突**：自动检测端口占用，遇到冲突自动顺延端口
- ⚡ **性能优化**：默认开启 Gzip 压缩支持
- 🌐 **SPA 支持**：支持单页应用 (Single Page Application) 的 History API Fallback

## 📦 安装

```bash
npm install -g rc-anywhere
```

## 🚀 核心命令与用法

`rc-anywhere` 提供了多个子命令来满足不同的开发场景。

### 1. 启动静态文件服务 (`serve`)

在打包后的目录（如 `dist` 或 `build`）中，直接运行：

```bash
rc-anywhere serve
```

**支持的参数：**
- `-p, --port <port>`: 指定端口号（默认 3000）
- `-d, --directory <path>`: 指定要作为静态服务的目录（默认为当前执行命令的目录 `process.cwd()`）
- `-o, --open`: 启动后自动在浏览器中打开
- `-c, --config <path>`: 指定代理配置文件路径（支持 .cjs 文件，默认读取当前目录下的 `proxyConfig.cjs`）
- `--cors`: 允许跨域请求
- `--no-gzip`: 禁用 Gzip 压缩

---

### 2. 启动 API Mock 服务 (`mock-server`) 🌟 新特性

当你需要快速模拟后端接口时，无需额外配置，一行代码即可启动一个 RESTful API 服务器。此命令完全独立于 `serve` 命令。

```bash
rc-anywhere mock-server
```
*如果当前目录下没有 `db.json` 文件，工具会自动为你生成一个包含示例数据的 `db.json` 并启动服务。*

**支持的参数（兼容 json-server）：**
- `-p, --port <port>`: 指定端口号（默认 3000，**遇冲突自动顺延**）
- `-f, --file <file>`: 指定数据源文件（默认 `db.json`）
- `-d, --delay <ms>`: 增加 API 响应延迟，用于模拟弱网环境（例如：`-d 2000`）
- `--read-only`: 开启只读模式，只允许 `GET` 请求，禁止修改数据
- `--no-cors`: 禁用 CORS 跨域支持
- `-q, --quiet`: 静默模式，不输出请求日志

---

### 3. 快速初始化代理配置 (`init`)

如果你需要配置 API 代理来解决跨域问题，可以先执行初始化：

```bash
rc-anywhere init
```

这会在当前目录生成一个 `proxyConfig.cjs` 模板文件。你只需修改此文件，然后在同级目录执行 `rc-anywhere serve` 即可。

## ⚙️ 代理配置示例 (`proxyConfig.cjs`)

代理配置基于 `http-proxy-middleware`，你可以根据需要配置多个代理路由。

```js
// 更多配置请参考: https://www.npmjs.com/package/http-proxy-middleware
module.exports = {
  '/api': {
    target: 'http://localhost:8080', // 你的后端接口地址
    changeOrigin: true,
    // 路径重写：将 /api 开头的请求重写为空
    // pathRewrite: { '^/api': '' } 
  },
  '/graphql': {
    target: 'http://localhost:4000',
    changeOrigin: true
  }
};
```

## 💻 作为 Node.js 模块使用

除了 CLI 命令行，你也可以在自己的 Node 脚本中集成它：

```javascript
const server = require('rc-anywhere');

// 启动静态服务并挂载代理
server.start({
  port: 3000,
  directory: './dist',
  proxyConfig: require('./proxyConfig.cjs'),
  open: true,
  cors: true
});
```

---

**欢迎提 [Issue](https://github.com/chenxigeng/rc-anywhere/issues) 和 PR！如果这个工具对你有帮助，不妨点个 ⭐️ Star！**

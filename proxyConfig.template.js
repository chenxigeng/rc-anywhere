/**
 * 代理配置模板
 * 配置文档参考 https://www.npmjs.com/package/http-proxy-middleware#pathrewrite-objectfunction
 * module.exports = {
    [需要代理的url]: {
      target: [代理目标地址],
      changeOrigin: true,
      pathRewrite: path => path.replace(/^\/api/, '')
    },
    // 可以在此添加更多代理配置
  }; 
 */
module.exports = {
  '/api': {
    target: 'https://remote-test.com', // 代理目标地址 假的
    changeOrigin: true,
    pathRewrite: path => path.replace(/^\/api/, '')
  },
  // 可以在此添加更多代理配置
}; 
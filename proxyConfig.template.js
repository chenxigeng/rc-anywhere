/**
 * 代理配置模板
 * module.exports = {
    [需要代理的url]: {
      target: [代理目标地址],
      changeOrigin: true
    },
    // 可以在此添加更多代理配置
  }; 
 * 类似vite的proxy设置
 */
module.exports = {
  '/api': {
    target: 'https://remote-test.com', // 代理目标地址 假的
    changeOrigin: true
  },
  // 可以在此添加更多代理配置
}; 
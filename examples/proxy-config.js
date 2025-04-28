// 代理配置示例
module.exports = {
  // 接口代理配置
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    // 可以添加路径重写
    // pathRewrite: { '^/api': '' }
  },
  
  // 多个代理配置
  '/graphql': {
    target: 'http://localhost:4000',
    changeOrigin: true
  }
}; 
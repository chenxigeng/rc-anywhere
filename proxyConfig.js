// 代理配置，类似vite的proxy设置
module.exports = {
  '/fullgoal_golden_wish/api': {
    target: 'https://dev-fg-hjxyc.dongbosy.com',
    changeOrigin: true
  },
  // 可以在此添加更多代理配置
}; 
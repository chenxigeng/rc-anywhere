const { createProxyMiddlewares } = require('../proxy');

module.exports = function getProxyMiddlewares(options) {
  const proxyConfig = options.proxyConfig || {};
  if (Object.keys(proxyConfig).length > 0) {
    return createProxyMiddlewares(proxyConfig);
  }
  return [];
};

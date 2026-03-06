const compress = require('koa-compress');

module.exports = function createCompressMiddleware(options) {
  if (!options.gzip) return null;
  
  return compress({
    threshold: 2048,
    gzip: {
      flush: require('zlib').constants.Z_SYNC_FLUSH
    },
    deflate: {
      flush: require('zlib').constants.Z_SYNC_FLUSH
    },
    br: false // 禁用 brotli，因为需要额外的二进制依赖，保持轻量
  });
};

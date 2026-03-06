const os = require('os');
const open = require('open');
const qrcode = require('qrcode-terminal');
const net = require('net');

/**
 * 检查端口是否可用，如果被占用则端口号+1继续检查
 * @param {number} port 初始端口号
 * @returns {Promise<number>} 可用的端口号
 */
function getAvailablePort(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(getAvailablePort(port + 1));
      } else {
        reject(err);
      }
    });
    server.listen(port, () => {
      const availablePort = server.address().port;
      server.close(() => {
        resolve(availablePort);
      });
    });
  });
}

/**
 * Get ip(v4) address
 * @return {String} the ipv4 address or 'localhost'
 */
const getIPAddress = function () {
  var ifaces = os.networkInterfaces();
  var ipList = [];
  for (var dev in ifaces) {
    ifaces[dev].forEach(function (details) {
      if (details.family === 'IPv4' && !details.internal) {
        ipList.push(details.address);
      }
    });
  }
  // Local IP first
  ipList.sort(function (ip1, ip2) {
    if(ip1.indexOf('192') >= 0){
      return -1;
    }
    return 1;
  });
  return ipList[0] || "127.0.0.1";
}

/**
 * 打开浏览器
 * @param {string} url 要打开的 URL
 */
function openBrowser(url) {
  open(url).catch(err => {
    console.error('无法打开浏览器:', err);
  });
}

/**
 * 打印二维码
 * @param {string} url 要生成二维码的 URL
 */
function printQRCode(url) {
  qrcode.generate(url, { small: true });
}

module.exports = {
  getIPAddress,
  openBrowser,
  printQRCode,
  getAvailablePort
};

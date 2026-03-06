const os = require('os');
const open = require('open');
const qrcode = require('qrcode-terminal');

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
  printQRCode
};

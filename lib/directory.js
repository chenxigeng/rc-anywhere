const fs = require('fs');
const path = require('path');

/**
 * 生成目录列表 HTML
 * @param {string} dirPath 目录绝对路径
 * @param {string} requestPath 请求路径
 * @returns {string} HTML 内容
 */
function generateDirectoryListing(dirPath, requestPath) {
  const files = fs.readdirSync(dirPath);
  
  // 排序：目录在前，文件在后
  files.sort((a, b) => {
    const aPath = path.join(dirPath, a);
    const bPath = path.join(dirPath, b);
    const aStat = fs.statSync(aPath);
    const bStat = fs.statSync(bPath);
    
    if (aStat.isDirectory() && !bStat.isDirectory()) return -1;
    if (!aStat.isDirectory() && bStat.isDirectory()) return 1;
    return a.localeCompare(b);
  });

  const listItems = files.map(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    const isDir = stats.isDirectory();
    const size = isDir ? '-' : formatSize(stats.size);
    const date = stats.mtime.toLocaleString();
    const icon = isDir ? '📁' : '📄';
    const href = path.join(requestPath, file).replace(/\\/g, '/');
    
    return `
      <tr>
        <td><a href="${href}">${icon} ${file}${isDir ? '/' : ''}</a></td>
        <td>${size}</td>
        <td>${date}</td>
      </tr>
    `;
  }).join('');

  const parentDir = path.dirname(requestPath);
  const parentLink = requestPath === '/' ? '' : `
    <tr>
      <td><a href="${parentDir === '.' ? '/' : parentDir}">🔙 ..</a></td>
      <td>-</td>
      <td>-</td>
    </tr>
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Index of ${requestPath}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; }
        h1 { font-size: 1.5rem; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
        a { text-decoration: none; color: #0366d6; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>Index of ${requestPath}</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Last Modified</th>
          </tr>
        </thead>
        <tbody>
          ${parentLink}
          ${listItems}
        </tbody>
      </table>
    </body>
    </html>
  `;
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  generateDirectoryListing
};

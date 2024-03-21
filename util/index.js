const fs = require("fs");
const path = require("path");

// 判断文件是否存在
function checkFileExists(filePath) {
  var basename = path.basename(filePath);
  if (!fs.existsSync(basename)) {
    return false;
  }
  return true;
}

module.exports = {
  checkFileExists
};

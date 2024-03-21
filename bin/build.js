const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const { config: initConfig } = require("../config");

function deleteDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    if (!fs.statSync(dirPath).isDirectory()) return;
    fs.readdirSync(dirPath).forEach(function (file) {
      const curPath = path.join(dirPath, file);
      if (fs.statSync(curPath).isDirectory()) {
        //删除文件夹
        deleteDir(curPath);
      } else {
        //删除文件
        fs.unlinkSync(curPath);
      }
    });
    //删除当前文件夹
    fs.rmdirSync(dirPath);
  }
}

function execSpawn(env) {
  const dir = initConfig.output && initConfig.output.split("/")[0];
  dir && deleteDir(path.basename(dir));
  spawn("npx", ["rollup", "-c", path.resolve(__dirname, "../config/index.js"), "--g", env], {
    stdio: "inherit" // 不需要输出
  }).on("error", (error) => {
    console.log(error);
  });
}

function build() {
  execSpawn();
}

function vis() {
  execSpawn("vis");
}

module.exports = {
  build: build,
  vis: vis
};

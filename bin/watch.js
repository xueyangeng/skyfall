const path = require("path");
const { spawn } = require("child_process");

function execSpawn() {
  spawn("npx", ["rollup", "-c", path.resolve(__dirname, "../config/index.js"), "-w"], {
    stdio: "inherit" // 不需要输出
  }).on("error", (error) => {
    console.log(error);
  });
}

module.exports = {
  watch: execSpawn
};

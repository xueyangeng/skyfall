const path = require("path");
const { checkFileExists } = require("./util/index");
const filePath = `${path.resolve("./")}/skyfall.js`;
const inputConfig = checkFileExists(filePath) ? require(filePath) : {};
const initConfig = {
  name: "skyfall",
  input: "index.js",
  output: "dist/build.js"
};
const config = { ...initConfig, ...inputConfig };
module.exports = { config };

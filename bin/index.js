const { config } = require("../config");

global.skyfall = {};
skyfall.config = config;

const { watch } = require("./watch");
const { build, vis } = require("./build");
const { upload } = require("./upload");
const { init } = require("./init");

module.exports = {
  watch,
  build,
  vis,
  upload,
  init
};

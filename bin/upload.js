const fs = require("fs");
const path = require("path");
const { default: Ryze } = require("@mt/sdk-ryze");

const { output } = skyfall.config;
function checkFileExists() {
  const dirs = path.dirname(output).split(path.sep);
  const distPath = dirs[dirs.length - 1];
  if (!fs.existsSync(distPath)) {
    console.log("Dist file not found, run this command after skyfall build.");
    process.exit(0);
  }
}

function upload() {
  checkFileExists(output);
  const filePath = path.resolve("./", output);
  if (fs.statSync(filePath).isDirectory()) {
    const readDir = fs.readdirSync(filePath);
    readDir.map((item) => {
      if (path.extname(item) === ".js") {
        uploadSingle(filePath + "/" + item);
      }
    });
  } else {
    uploadSingle(filePath);
  }
}

function uploadSingle(filePath) {
  const ryze = new Ryze({
    provider: "tc"
  });
  ryze
    .upload(filePath)
    .then((data) => {
      data.originalUrl = filePath;
      console.log(data);
    })
    .catch((e) => {
      console.log(e);
    });
}

module.exports = {
  upload
};

const fs = require("fs");
const inquirer = require("inquirer");

function questions() {
  return inquirer.prompt([
    {
      name: "name",
      message: "specify your project name:"
    },
    {
      name: "globalVar",
      message: "Specify a name plug  to window or just press enter:"
    }
  ]);
}

// 下载配置文件模版
function getFiles({ name }) {
  const skyfallContent = `module.exports = ${JSON.stringify({ name: name })}`;
  fs.writeFileSync("skyfall.js", skyfallContent, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  const babelContent = JSON.stringify({
    presets: [
      [
        "@babel/preset-env",
        {
          modules: false,
          useBuiltIns: "usage",
          corejs: "3"
        }
      ]
    ]
  });
  fs.writeFileSync(".babelrc", babelContent, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

async function init() {
  const answers = await questions();
  try {
    getFiles(answers);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  init
};

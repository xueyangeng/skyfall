#!/usr/bin/env node
const program = require("commander");
const emoji = require("node-emoji");
const chalk = require("chalk");
const { watch, build, vis, upload, init } = require("./bin");

program
  .version(require("./package.json").version)
  .description("Small and delightful sdk cli, i'am skyfall");

// 初始化项目 命令
program
  .command("init")
  .description("init a configure file")
  .action(() => {
    init();
  });

// 监听文件变化 并会重新打包 命令
program
  .command("watch")
  .description("watch changes for development and build")
  .action(() => {
    watch();
  });

// 打包 命令
program
  .command("build")
  .description(
    'build for dev, and you can add NODE_ENV="production" To distinguish the environment'
  )
  .action(() => {
    build();
  });

// 打包 并查看包大小 命令
program
  .command("vis")
  .description(
    'build visualizer for dev, and you can add NODE_ENV="production" To distinguish the environment'
  )
  .action(() => {
    vis();
  });

// 上传cdn 命令
program
  .command("upload")
  .description("upload dist file and output the cdn url")
  .action(() => {
    upload();
  });

program.on("command:*", () => {
  // 此输出只为一行空白
  console.log("");
  console.log(emoji.get("warning"), chalk.yellow("Command not found, see usage:"));
  // 帮助信息
  console.log(program.helpInformation());
});

program.parse(process.argv);

const NO_COMMAND_SPECIFIED = program.args.length === 0;

// 如果执行时没有命令 提示帮助信息
if (NO_COMMAND_SPECIFIED) {
  console.log(program.helpInformation());
}

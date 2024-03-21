import path from "path";
import util from "util";
import babel from "rollup-plugin-babel";
// import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import visualizer from "rollup-plugin-visualizer";
// import serve from "rollup-plugin-serve";
import typescript from "rollup-plugin-typescript2";
import image from "rollup-plugin-image";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
// postcss plugins
import simplevars from "postcss-simple-vars";
import nested from "postcss-nested";
import cssnext from "postcss-cssnext";
import cssnano from "cssnano";

const { checkFileExists } = require("../util/index");

const { config: initConfig } = require("../config");

module.exports = (mode) => {
  const env = mode.g;
  let currentInput = initConfig.input;
  let currentOutput = {
    file: initConfig.output,
    format: "umd",
    name: "bundle"
  };
  const currentPlugins = [
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || "development")
    }),
    // node模块正确加载
    commonjs({
      include: path.resolve("./", "node_modules/**")
    }),
    // node模块正确加载
    // resolve(),
    // 全局环境变量
    // 编译ts文件
    checkFileExists("tsconfig.json") &&
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: false //生成相应的 .d.ts文件
          }
        }
      }),
    // 读取json信息的
    json(),
    // 设置Babel来使旧浏览器也支持ES6的代码
    babel({
      exclude: "node_modules/**" // 只编译我们的源代码
    }),
    image(), // 打包图片为base64
    // 打包css
    postcss({
      extensions: [".css", ".less"],
      plugins: [simplevars(), nested(), cssnext({ warnForDuplicates: false }), cssnano()],
      use: [
        [
          "less",
          {
            javascriptEnabled: true
          }
        ]
      ]
    }),
    // process.env.NODE_ENV !== "production" &&
    //   serve({
    //     open: true, // 是否打开浏览器
    //     contentBase: "src", // 入口html的文件位置
    //     historyApiFallback: true, // Set to true to return index.html instead of 404
    //     host: "localhost",
    //     port: 10001 // 五位数
    //   }),
    env == "vis" &&
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      })
  ];
  const outDir = initConfig.output && initConfig.output.split("/")[0];
  const dtsConfig = {
    input: currentInput,
    output: { file: outDir + "/index.d.ts", format: "es" },
    plugins: [...currentPlugins, dts()]
  };
  if (util.isObject(initConfig.input)) {
    currentOutput = {
      dir: initConfig.output,
      format: "es"
    };
    dtsConfig.output = currentOutput;
  }
  let config = {
    input: currentInput,
    output: currentOutput,
    plugins: [...currentPlugins, process.env.NODE_ENV === "production" && uglify()]
  };
  let currentConfig = [config];
  if (checkFileExists("tsconfig.json")) {
    currentConfig = [config, dtsConfig];
  }
  return currentConfig;
};

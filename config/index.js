import path from "path";
import util from "util";
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import visualizer from "rollup-plugin-visualizer";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import typescript from "rollup-plugin-typescript2";
import image from "rollup-plugin-image";
import dts from "rollup-plugin-dts";
import filesize from "rollup-plugin-filesize";
import postcss from "rollup-plugin-postcss";
// postcss plugins
import simplevars from "postcss-simple-vars";
import nested from "postcss-nested";
import cssnext from "postcss-cssnext";
import cssnano from "cssnano";

const { checkFileExists } = require("../util/index");

const { config: initConfig } = require("../config");

module.exports = (mode) => {
  const type = mode.g;
  const env = process.env.NODE_ENV;
  // 传入的config
  const {
    input: initInput,
    output: initOutput,
    name: initName = "bundle",
    servePlugin: initServePlugin = false,
    livereloadPlugin: initLivereloadPlugin = false,
    resolvePlugin: initResolvePlugin = false
  } = initConfig;

  // 打包使用的插件
  const plugins = [
    replace({
      ENV: JSON.stringify(env || "development")
    }),
    // node模块正确加载
    commonjs({
      include: path.resolve("./", "node_modules/**")
    }),
    // node模块正确加载
    initResolvePlugin && resolve(),
    // 编译ts文件
    checkFileExists("tsconfig.json") &&
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: false // 禁止生成相应的 .d.ts文件 自己生成
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
    // 启动服务， 查看包引用变化
    env !== "production" && initServePlugin && serve(initServePlugin),
    // 监听文件变化刷新浏览器
    env !== "production" && initLivereloadPlugin && livereload(initLivereloadPlugin),
    type == "vis" &&
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      })
  ];
  // 处理过后的output配置
  let currentOutput = {
    file: initOutput,
    format: "umd",
    name: initName
  };
  // 多文件打包
  if (util.isObject(initInput)) {
    currentOutput = {
      dir: initOutput,
      format: "es"
    };
  }
  // 打包生成js的配置
  const config = {
    input: initInput,
    output: currentOutput,
    plugins: [...plugins, ...(env === "production" ? [uglify(), filesize()] : [])]
  };
  let finalConfig = config;
  if (checkFileExists("tsconfig.json")) {
    // 打包生成dts的配置
    const dtsConfig = {
      input: initInput,
      output: {
        file: initOutput.replace(".js", ".d.ts"),
        format: "es"
      },
      plugins: [...plugins, dts()]
    };
    if (currentOutput.format === "es") {
      dtsConfig.output = currentOutput;
    }
    finalConfig = [config, dtsConfig];
  }
  return finalConfig;
};

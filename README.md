# skyfall

基于 rollup 打包 js 库

- 支持 js 文件打包
- 支持 ts 文件打包
- 支持 css 文件打包
- 支持 less 文件打包
- 支持 es6 转译

## 如何使用

```bash
npm i skyfall -D
```

```cmd
skyfall --help/skyfall -h  // 查看skyfall命令

skyfall --version/skyfall -V  // 查看skyfall版本

skyfall init  // 初始化 skyfall.js 配置文件

skyfall build  // 打包，不压缩

NODE_ENV=production skyfall build  // 打包，并压缩 (.d.ts文件不会被压缩)

skyfall vis  // 打包并查看各个模块占用大小， 不压缩

NODE_ENV=production skyfall vis  // 打包并查看各个模块占用大小，并压缩(.d.ts文件不会被压缩)

skyfall watch   // 打包并监听文件变化

skyfall upload  // 打包后上传cdn并输出cdn地址
```

## skyfall.js

#单个文件
module.exports = {
  name: 'skyfall', // 项目名称
  input: 'index.js', // 入口文件路径
  output: 'dist/build.js', // 出口文件路径
} 
#多个文件
module.exports = {
  name: 'skyfall', // 项目名称
  input: {
  index: "index.js",
  aa: "aa/index.js",
  bb: "bb/index.js",
  } // 入口文件路径
  output: 'dist', // 出口文件夹路径
}

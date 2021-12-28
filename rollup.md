### 介绍
rollup是一个JavaScript模块打包器，可以从一个入口文件开始，将所有用到的模块文件都打包到一个最终的发布文件中，及其适合构建一个工具库。
它具有两个重要特性：
1. 它使用ES6的模块标准，你可以在代码中直接使用import、export而不需引入babel
2. 具有tree-shaking特性，帮你讲无用代码从最终文件中删除（这个特征基于ES6模块的静态分析，也就是说，只有export而没有import的变量是不会打包到最终代码的）
### 安装
    npm i rollup
    yarn add rollup
### 配置
rollup可以直接使用命令也可以使用配置文件
    
    input：入口文件
    plugins：插件
    output: {
      file 输出文件
      format 五种输出格式：amd /  es6 / iife / umd / cjs
      name:'A'  //当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
      sourcemap:true  //生成bundle.map.js文件，方便调试
    }
    external:['lodash'] //告诉rollup不要将此lodash打包，而作为外部依赖
    global:{
      'jquery':'$'  //告诉rollup 全局变量$即是jquery
    }
常用插件

    // rollup typescript配置处理
    `@rollup/plugin-typescript`
    /*
    * 帮助寻找node_modules里的包
    * rollup.js编译源码中的模块引用默认只支持ES6+的模块方式import/export。
    * 然而大量的npm模块是基于CommonJS模块方式，这就导致了大量 npm 模块不能直接编译使用。
    * 所以辅助rollup.js编译支持npm模块和CommonJS模块方式的插件就应运而生
    */
    `@rollup/plugin-node-resolve`
    // 支持import 'xx.json'文件
    `@rollup/plugin-json`
    // 在打包的时候把目标字符串替换å
    `@rollup/plugin-replace`
    // 对打包的js进行压缩
    `rollup-plugin-terser`
    // 删除原来的bundle
    `rollup-plugin-delete`
    // 显示打包后文件的大小
    `rollup-plugin-filesize`
    // 将CommonJs语法转成es5
    `rollup-plugin-commonjs`
    // rollup 的 babel 插件，ES6转ES5
    `rollup-plugin-babel`

### package json的main和module
- main : 定义了 npm 包的入口文件，browser 环境和 node 环境均可使用
- module : 定义 npm 包的 ESM 规范的入口文件，browser 环境和 node 环境均可使用
- browser : 定义 npm 包在 browser 环境下的入口文件
------

- 如果 npm 包导出的是 ESM 规范的包，使用 module
- 如果 npm 包只在 web 端使用，并且严禁在 server 端使用，使用 browser。
- 如果 npm 包只在 server 端使用，使用 main
- 如果 npm 包在 web 端和 server 端都允许使用，使用 browser 和 main
- 其他更加复杂的情况，如npm 包需要提供 commonJS 与 ESM 等多个规范的代码文件，请参考上述使用场景或流程图

### 打包结果
在package json中配置main和module
如果format为es，则设置module为打包结果
如果format为cjs，则设置main为打包结果

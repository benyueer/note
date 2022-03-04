#### 配置

### vue-cli+webpack+vue2
1. 使用vue-cli创建项目，选择vue2+ts
2. 安装 vue-tsx-support 包
3. 编辑tsconfig.json
    ```json
      ...
      "include": [
          "node_modules/vue-tsx-support/enable-check.d.ts",  
          "src/**/*.ts",
          "src/**/*.tsx",
          "src/**/*.vue",
          "tests/**/*.ts",
          "tests/**/*.tsx"
        ]
      // 注意：将exclude内的 "node_modules" 删掉，不然永远也无法被引用到了
        ...
    ```
4. 在main.ts中
    ```ts
    import "vue-tsx-support/enable-check";
    ```
5. 删除根目录下的 shims-tsx.d.ts ，否则会报重复定义的错误。
6. 根目录新建 vue.config.js
    ```js
    module.exports = {
      css: {
        modules: true // 开启CSS module
      },
      configureWebpack: {
        resolve: {
          extensions: [".js", ".vue", ".json", ".ts", ".tsx"] // 加入ts 和 tsx
        },
      },
      devServer: {
        port: 8800 // webpack-dev-server port
      }
    };
    ```
7. 创建组件
    ```ts
    import { Component } from 'vue-property-decorator'
    import * as tsx from "vue-tsx-support"

    @Component
    export default class App extends tsx.Component<Record<string, unknown>> {
      protected render(): string {
        return (
          <div id="app">
            <router-view></router-view>
          </div>
        )
      }
    }
    ```
8. CSS Module
    1. ts声明
        ```ts
        declare module "*.scss" {
          const content: any;
          export default content;
        }
        ```
    2. 在vue.config.js中
        ```js
        module.exports = {
          css: {
            modules: true // 开启CSS module
          }
        };
        ```
9. SCSS配置
    1. 正确匹配sass编译loader组合版本，经过实践如下匹配可正常编译：
        - node-sass@4.13.0 sass-loader@7.0.0
        - sass@1.18.0 sass-loader@7.1.0
    2. 另 less编译组合版本
        - less@4.0.0 less-loader@7.0.1



### vue3+vite
1. vite配置vueJsx插件
    ```js
    plugins: [vueJsx()]
    ```


#### jsx基础用法
[Babel Plugin JSX for Vue 3.0](https://github.com/vuejs/babel-plugin-jsx#installation)





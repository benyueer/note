eslint
```js
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    '@vue/standard',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none'
        },
        singleline: {
          delimiter: 'comma'
        }
      }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    camelcase: 'off',
    'vue/array-bracket-spacing': 'error',
    'one-var': 'off',
    'no-multiple-empty-lines': 'warn',
    'vue/arrow-spacing': 'error',
    'vue/block-spacing': 'error',
    'vue/brace-style': 'error',
    'vue/camelcase': 'error',
    'vue/comma-dangle': 'error',
    'vue/component-name-in-template-casing': 'off',
    'vue/eqeqeq': 'error',
    'vue/key-spacing': 'error',
    'vue/match-component-file-name': 'error',
    'no-useless-escape': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'comma-dangle': 'off',
    eqeqeq: 'off',
    'operator-linebreak': 'off',
    'array-callback-return': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/object-curly-spacing': 'off',
    'no-return-assign': 'off',
    'space-before-function-paren': 'off',
    'no-template-curly-in-string': 'off',
    'no-useless-constructor': 'off',
    'prefer-const': 'warn',
    'prefer-promise-reject-errors': 'off',
    'no-extra-boolean-cast': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    'n/handle-callback-err': 'warn',
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        allowDestructuring: true, // Allow `const { props, state } = this`; false by default
        allowedNames: ['self'] // Allow `const self = this`; `[]` by default
      }
    ],
    'vue/attribute-hyphenation': 'off',
    'vue/custom-event-name-casing': 'off'
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ]
}
```

prettier
```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "semi": false
}
```
```
printWidth: 100, // 超过最大值换行
tabWidth: 4, // 缩进字节数
useTabs: false, // 缩进不使用tab，使用空格
semi: true, // 句尾添加分号
singleQuote: true, // 使用单引号代替双引号
proseWrap: "preserve", // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
arrowParens: "avoid", //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
disableLanguages: ["vue"], // 不格式化vue文件，vue文件的格式化单独设置
endOfLine: "auto", // 结尾是 \n \r \n\r auto
eslintIntegration: false, //不让prettier使用eslint的代码格式进行校验
htmlWhitespaceSensitivity: "ignore",
ignorePath: ".prettierignore", // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
jsxBracketSameLine: false, // 在jsx中把'>' 是否单独放一行
jsxSingleQuote: false, // 在jsx中使用单引号代替双引号
parser: "babylon", // 格式化的解析器，默认是babylon
requireConfig: false, // Require a 'prettierconfig' to format prettier
stylelintIntegration: false, //不让prettier使用stylelint的代码格式进行校验
trailingComma: "es5", // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
tslintIntegration: false // 不让prettier使用tslint的代码格式进行校验
```

ignore
```
node_modules
.vscode
.idea
dist
/public
.eslintrc.js
```
---
title: "Vue2项目添加eslint、prettier、typescript格式化"
date: 2023-02-28T09:14:44+08:00
draft: true
tags: ["vue2", "eslint", "prettier"]
categories: ["vue"]
---

# Vue2 项目添加 eslint、prettier、typescript 格式化



## vscode 初始化准备

安装 prettier 插件、安装 eslint 插件



## 安装 eslint



[Documentation - ESLint - Pluggable JavaScript Linter](https://eslint.org/docs/latest/)



> yarn add eslint eslint-plugin-vue -D

eslint 用于校验代码语法问题

项目根目录下新建.eslintrc.js 文件

```js
module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ["vue"],
  extends: ["eslint:recommended", "plugin:vue/essential"], //定义文件继承的子规范
};
```

这是初始化的配置

这里 parser 需要设置成`vue-eslint-parser`, 这样 eslint 就可以识别到 vue 的语法

#### eslint-plugin-vue

这个是 eslint 用于校验 vue 语法的插件，可以校验 vue 文件中的 template 中的 html、script 中的 js 语法

vscode 进行 eslint 的相关配置，这里配置了保存自动格式化

```json
{
  "eslint.enable": true, //是否开启vscode的eslint
  "eslint.options": {
    //指定vscode的eslint所处理的文件的后缀
    "extensions": [".js", ".vue", ".ts", ".tsx"]
  },
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "eslint.validate": [
    //确定校验准则
    "javascript",
    "javascriptreact",
    "html",
    "vue",
    "typescript"
  ]
}
```

### .eslintignore

该文件用于设置项目中需要忽略校验的目录

```perl
# 忽略build目录下类型为js的文件的语法检查
build/*.js
lib/**/*.js
# 忽略src/assets目录下文件的语法检查
src/assets
src/pages
src/font
```

## 安装 prettier



[What is Prettier? · Prettier](https://prettier.io/docs/en/index.html)



> yarn add prettier eslint-plugin-prettier eslint-config-prettier -D

prettier 用于校验代码格式化问题， 这里我们用 prettier 作为 eslint 的插件使用

项目根目录下新建文件.prettierrc

```json
{
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all"
}
```

这里最好也建一个.editorconfig ， 2 个配置文件会进行合并，最终以 prettierrc 文件为准

```yaml
# 告诉EditorConfig插件，这是根文件，不用继续往上查找
root = true

# 匹配全部文件
[*]
# 设置字符集
charset = utf-8
# 缩进风格，可选space、tab
indent_style = space
# 缩进的空格数
indent_size = 2
# 结尾换行符，可选lf、cr、crlf
end_of_line = lf
# 在文件结尾插入新行
insert_final_newline = true
# 删除一行中的前后空格
trim_trailing_whitespace = true

# 匹配md结尾的文件
[*.md]
insert_final_newline = false
trim_trailing_whitespace = false

```

#### eslint-config-prettier

解决一些初始化的 prettier 配置问题

eslint 配置文件中加入 prettier 相关的插件

```js
module.exports = {
  plugins: ["vue", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:vue/essential",
    "eslint-config-prettier",
  ],
};
```

vscode 配置中加入 prettier 格式化的部分

```json
{
  "eslint.enable": true, //是否开启vscode的eslint
  "eslint.options": {
    //指定vscode的eslint所处理的文件的后缀
    "extensions": [".js", ".vue", ".ts", ".tsx"]
  },
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "eslint.validate": [
    //确定校验准则
    "javascript",
    "javascriptreact",
    "html",
    "vue",
    "typescript"
  ],
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### .prettierignore

该文件用于设置项目中需要忽略格式化的目录

```perl
.git
.svn
.idea
node_modules

lib
oss
plop
server
```

## 安装 typescript

> yarn add typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser -D

安装项目中需要的 ts 相关的插件

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "importHelpers": true,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "baseUrl": ".",
    "allowJs": true,
    "checkJs": false,
    "types": ["node", "webpack-env"],
    "paths": {
      "@/*": ["src/*"]
    },
    "lib": ["esnext", "dom", "dom.iterable", "scripthost"],
    "typeRoots": ["node_modules/@types"]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": ["node_modules", "lib", "server"]
}
```

eslint 配置中加入 ts 相关的插件

```js
// ESlint 检查配置
module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2015,
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    ecmaFeatures: { jsx: true, globalReturn: false },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ["vue", "prettier", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:vue/essential",
    "eslint-config-prettier",
    "plugin:@typescript-eslint/recommended",
  ],
};
```

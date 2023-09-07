---
title: "npm使用常见问题及解决方案"
date: 2022-08-10T08:52:24+08:00
draft: true
tags: ["npm publish"]
categories: ["npm"]
---

# npm使用常见问题及解决方案

### Beginning October 4, 2021, all connections to the npm registry - including for package installation - must use TLS 1.2 or higher. You are currently using plaintext http to connect.

> npm config set registry https://registry.npmjs.org

### You should bug the author to publish it (or use the name yourself!)


### npm publish scope not found

当你要发布以`@xxx/xxx`开头的包时，控制台报错

```bash
npm notice
npm ERR! code E404
npm ERR! 404 Not Found - PUT https://registry.npmjs.org/@xxx%2fxxx - Scope not found
npm ERR! 404
npm ERR! 404  '@xxx/xxx@0.0.0' is not in this registry.
npm ERR! 404 You should bug the author to publish it (or use the name yourself!)
npm ERR! 404
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.

npm ERR! A complete log of this run can be found in:
```

原因是npm上没有对应的组织，需要到npm控制台上先创建对应`name`的组织

`npm publish --access public`


https://stackoverflow.com/questions/43824012/how-to-publish-npm-scoped-packages-npm-scope-not-found


### npm 安装本地包

https://stackoverflow.com/questions/14381898/local-dependency-in-package-json

```js
npm install --save file:src/assets/js/FILE_NAME
```


### Cannot read properties of null (reading 'pickAlgorithm')

```bash
npm cache clear --force

npm install
```
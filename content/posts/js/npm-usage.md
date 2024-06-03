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

### verbose stack TypeError: Invalid Version

```bash
41 http fetch GET 200 https://registry.npmmirror.com/fsevents 25ms (cache hit)
42 silly placeDep ROOT fsevents@2.3.3 KEEP for: chokidar@3.6.0 want: ~2.3.2
43 timing idealTree Completed in 508ms
44 timing command:i Completed in 555ms
45 verbose stack TypeError: Invalid Version: 
45 verbose stack     at new SemVer (/data1/node/node-v16.17.0/lib/node_modules/npm/node_modules/semver/classes/semver.js:38:13)
45 verbose stack     at compare (/data1/node/node-v16.17.0/lib/node_modules/npm/node_modules/semver/functions/compare.js:3:32)
45 verbose stack     at Object.gte (/data1/node/node-v16.17.0/lib/node_modules/npm/node_modules/semver/functions/gte.js:2:30)
45 verbose stack     at Node.canDedupe (/data1/node/node-v16.17.0/lib/node_modules/npm/node_modules/@npmcli/arborist/lib/node.js:1071:32)
45 verbose stack     at PlaceDep.pruneDedupable (/data1/node/node-v16.17.0/lib/node_modules/npm/node_modules/@npmcli/arborist/lib/place-dep.js:468:14)
45 verbose stack     at PlaceDep.pruneDedupable (/data1/node/node-v16.17.0/lib/node_modules/npm/node_modules/@npmcli/arborist/lib/place-dep.js:486:14)
45 verbose stack     at PlaceDep.pruneDedupable (/data1/node/node-v16.17.0/lib/node_modules/npm/node_modules/@npmcli/arborist/lib/place-dep.js:486:14)
45 verbose stack     at PlaceDep.placeInTree (/data1/node/node-v16.17.0/lib/node_modules/npm/node_modules/@npmcli/arborist/lib/place-dep.js:270:12)
45 verbose stack     at PlaceDep.place (/data1/node/node-v16.17.0/lib/node_modules/npm/node_modules/@npmcli/arborist/lib/place-dep.js:216:10)
45 verbose stack     at new PlaceDep (/data1/node/node-v16.17.0/lib/node_modules/npm/node_modules/@npmcli/arborist/lib/place-dep.js:73:10)
46 verbose cwd /root/.jenkins/workspace/smart-wms-engoal-front
47 verbose Linux 3.10.0-1160.31.1.el7.x86_64
48 verbose node v16.17.0
49 verbose npm  v8.15.0
50 error Invalid Version: 
```

Deleting`node_modules` and `package-lock.json (OR yarn.lock)`

```
rm -rf node_modules && rm -rf package-lock.json
```
---
title: "Lerna 包管理器命令行"
date: 2021-11-16T09:14:20+08:00
draft: false
tags: [ "js", "nodejs" ]
---

```bash
$ npm install lerna -g
$ mkdir lerna-demo
$ cd lerna-demo && lerna init --independent # 用的默认的固定模式，vue babel等都是这个

$ cd packages
$ mkdir moduleA && mkdir moduleB
...
#分别进入三个目录初始化成包
$ cd moduleA
$ npm init -y && touch index.js
$ cd moduleB
$ npm init -y && touch index.js

$ lerna add lodash-es # 所有的子包添加相同的依赖
```

## Script

### 1. lerna create <name> [loc]

> 创建一个包，name包名，loc 位置可选


### 2. lerna add <package>[@version] [--dev] [--exact]

> 增加本地或者远程package做为当前项目packages里面的依赖

- --dev devDependencies 替代 dependencies
- --exact 安装准确版本，就是安装的包版本前面不带^, Eg: "^2.20.0" ➜ "2.20.0"

### 3. lerna list
> 列出所有的包

```sh
➜  lerna-demo git:(master) ✗ lerna list
lerna notice cli v4.0.0
lerna info versioning independent
modulea
moduleb
lerna success found 2 packages
```

### 4. lerna import
> 导入本地已经存在的包

### 5. lerna run
> 运行所有包里面的有这个script的命令

### 6. lerna exec

> 运行任意命令在每个包

```sh
$ lerna exec -- < command > [..args] # runs the command in all packages
$ lerna exec -- rm -rf ./node_modules
$ lerna exec -- protractor conf.js
lerna exec --scope my-component -- ls -la
```

### 7. lerna link
> 项目包建立软链，类似npm link

### 8. lerna clean
> 删除所有包的node_modules目录

### 9. lerna publish

> 会打tag，上传git,上传npm。
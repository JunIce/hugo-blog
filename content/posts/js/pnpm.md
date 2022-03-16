---
title: "pnpm -- 软件包管理器"
date: 2021-12-06T10:36:00+08:00
draft: true
tags: ["js", "npm"]
---
## npm yarn 和 pnpm 区别

`pnpm` 是最近一段时间刚刚出来的包管理工具，官方文档地址 [https://www.pnpm.cn/](https://www.pnpm.cn/)

一出来就受到很多开源项目使用，star数也突破13k

这里研究一下具体和npm有什么不同

### 安装

> npm install -g pnpm

### 使用

> pnpm install xxx
> 
> pnpm add xxx
> 
> ...

其他使用命令和npm 使用方法一致

### tree

我以项目中安装`express`为例

这里使用到一个Linux命令`tree`，方便查看最终安装的目录树

###### 安装

> sudo apt-get install tree

###### 使用

需要展示的目录下命令

> tree -L 2

### npm tree

npm 安装树

```bash
.
├── index.js
├── node_modules
.
.
.
│   ├── express
.
.
.
├── package-lock.json
└── package.json
```

### pnpm tree

pnpm 安装的最终目录

```bash
.
├── index.js
├── node_modules
│   ├── .pnpm // 缓存目录
│   ├── express -> /mnt/d/workspace/demo/blog/demo/work-note/pnpm-demo/pnpm/node_modules/.pnpm/registry.nlark.com+express@4.17.1/node_modules/express/
│   │   ├── History.md
│   │   ├── LICENSE
│   │   ├── Readme.md
│   │   ├── index.js
│   │   ├── lib
│   │   │   ├── application.js
│   │   │   ├── express.js
│   │   │   ├── middleware
│   │   │   │   ├── init.js
│   │   │   │   └── query.js
│   │   │   ├── request.js
│   │   │   ├── response.js
│   │   │   ├── router
│   │   │   │   ├── index.js
│   │   │   │   ├── layer.js
│   │   │   │   └── route.js
│   │   │   ├── utils.js
│   │   │   └── view.js
│   │   └── package.json
│   └── mime-types -> /mnt/d/workspace/demo/blog/demo/work-note/pnpm-demo/pnpm/node_modules/.pnpm/registry.npmmirror.com+mime-types@2.1.34/node_modules/mime-types/
│       ├── HISTORY.md
│       ├── LICENSE
│       ├── README.md
│       ├── index.js
│       └── package.json
├── package.json
└── pnpm-lock.yaml
```

### npm/yarn 安装过程

执行 npm/yarn install之后

执行命令后，首先会构建依赖树，然后针对每个节点下的包，会经历下面四个步骤:

- 1. 将依赖包的版本区间解析为某个具体的版本号
- 2. 下载对应版本依赖的 tar 包到本地离线镜像
- 3. 将依赖从离线镜像解压到本地缓存
- 4. 将依赖从缓存拷贝到当前目录的 node_modules 目录

其中npm1,npm2 在版本初期，node_modules 出现的是嵌套结构，导致下载非常慢，资源利用率很低，重复引用重复下载

npm3以后的版本 、yarn 安装后的目录是一个平铺的结构、扁平化依赖， 也就是我们安装一个express，出现了很多其他的包。 但其中问题也很明显， 1） 结构不在稳定， 2） 就是原本没有权限访问的npm包，现在因为都平铺了，导致都可以访问，这也是为什么出现`lock`文件的原因, 如果其他不同的包 依赖的同一个包 版本不一致

### pnpm 安装过程

node_modules下安装的什么就是什么，这里`express`其实是一个软连接， 链接到同目录下的`.pnpm`目录，这里才是库最终的安装地址，其中文件夹的命名方式是`注册域名+包名@版本号`, 这种方式极大程度上避免了npm的那些确定，

- 1. 同版本的不会重复安装
    
- 2. node_modules结构也更加稳定

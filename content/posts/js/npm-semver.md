---
title: "npm -- semver语义化版本规范"
date: 2022-03-12T21:34:19+08:00
draft: true
tags: ["js", "npm", "package.json"]
---

# npm-semver语义化版本规范



官方地址https://docs.npmjs.com/about-semantic-versioning

`semantic versioning`即是语义化规范，由`npm`官方维护，实现了版本和版本范围的计算、解析



## 版本格式

`MAJOR.MINOR.PATCH`

![](https://www.leixuesong.com/wp-content/uploads/2020/09/SemVer.png)

- MAJOR: 主版本号，存在不兼容的api修改
- MINOR：当做了向下兼容的功能性新增
- PATCH：当做了向下兼容的问题修正



## 依赖版本号



- `^`:  同一主版本号，且安装的版本号不小于指定版本号

```bash
^3.2.4 // 表示安装主版本3，且版本不小于3.2.4的版本
```



- `～`： 同一主版本号和次版本号，且安装版本号不小于指定版本号

```bash
^3.2.4 // 表示安装主版本3，次版本是2， 且版本不小于3.2.4的版本
```



- `>`、`<`、`=`、`>=`、`<=`、`-`：用来指定一个版本号范围

```bash
>=3.1 <=3.5 // 表示版本号 大于3.1 小于3.5

3.1-3.5 // 表示版本号 大于3.1 小于3.5
```



- `||`：表示或

```bash
<2.0 || > 3.1 // 表示小于2.0 或者 大于3.1
```



- `x`、`X`、`*`：通配符

```bash
* // 任何版本
2.x // 主版本是2的任意版本
```


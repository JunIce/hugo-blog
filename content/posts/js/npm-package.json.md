---
title: "npm -- package.json文件各字段详细说明"
date: 2022-03-12T21:15:04+08:00
draft: true
---

# package.json文件各字段详细说明

## name

项目的名称


## version

版本号

​	**major.minor.patch(主版本.次版本.修复版本号)**

- **major**: 新的架构调整，不兼容老版本
- **minor**:  新增功能，兼容老版本
-  **minor**:  修复bug，兼容老版本



## keywords

关键词，用户在github搜索的时候会优先搜索出来



## description

项目相关的描述



## homepage

对应的项目主页



## main

指定项目的主入口文件



## module

ES6 规范, ES Module的主入口文件，方便Tree Shaking



## types

定义类型声明入口文件



## typings

类型文件



## scripts

一个对象，key是需要运行的命令，value是具体执行的命令

```json
"scripts": {
    "test": "node test/run.js"
}
```



## dependencies

仓库依赖的模块，安装时使用`--save`会安装到下面, 用户生产环境中会使用到的库。

**在发布npm包的时候，本身dependencies下的模块会作为依赖，一起被下载**



## devDependencies

仓库依赖的模块，安装时使用`--save-dev`会安装到下面,  仓库在开发环境中会使用到的库。

### **重点**

有些文章说依赖放`dependencies`和`devDependencies`会打包到最终的`bundle`中，其实并没有什么关系，打包是`webpack`等打包工具去做的事情，和这么没有直接关系。

第三方发布的库，在开发的时候使用的工具，可以放到`devDependencies`中，这样在下载使用的时候可以减少安装包的数量



## peerDependencies

开发库依赖的第三方库，在npm install 的时候会强制下载



## bundledDependencies

指定发布的时候会被一起打包的模块。



## optionalDependencies

如果一个依赖模块可以被使用， 同时你也希望在该模块找不到或无法获取时npm继续运行，你可以把这个模块依赖放到optionalDependencies配置中



## files

包含项目中的文件的数组. 可以使用`.npmignore`去忽略在`npm install `安装时忽略的文件, 减少安装文件的数量，提示下载速度



## browserslist

支持的浏览器版本

```json
"browserslist": [
      "last 3 Chrome versions",
      "last 3 Firefox versions",
      "Safari >= 10",
      "Explorer >= 11",
      "Edge >= 12",
      "iOS >= 10",
      "Android >= 6"
 ]
```



## engines

可以指定运行的node版本

`{ "engines" : { "node" : ">=0.10.3 <0.12" } }`



## os

指定运行的操作系统

`"os" : [ "darwin", "linux", "win32" ]`



## contributors

仓库的贡献者

### 
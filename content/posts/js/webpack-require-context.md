---
title: "webpack -- require.context使用"
date: 2022-03-15T17:00:26+08:00
draft: true
tags: ["js", "webpack"]
categories: ["webpack"]
---

# `require.context`使用



用于在`webpack`中实现自动导入，自动遍历文件的方法



## API



```js
require.context(
  directory{string},//要搜索的文件夹路径
  useSubdirectories {Boolean},//是否读取文件下子目录
  regExp{RegExp}//正则
);
```



返回一个上下文函数，包括3个参数

- ​    resolve: 是一个函数，他返回的是被解析模块的id ，接受一个参数request。
- ​    keys: 也是一个函数，他返回的是一个数组，该数组是由所有可能被上下文模块解析的请求对象组成
- ​    id：上下文模块的id



## 用法



```js
const context = require.context("./modules", false, /\.js$/);

// 它将自动导入 modules下所有文件, 不包括子文件夹下的文件
// context 是一个函数，有resolve, keys, id三个参数
// context.keys(); //返回匹配成功模块的相对路径组成的数组["./app.js"]
context.keys().forEach(key=>{
    const fileModule=context.keys(key).default;//获取导出文件内容，获取以export.default方式导出的文件内容
    
})

```



## 案例



### 1. 批量注册`vue`组件



```js
import Vue from 'vue'
// 自定义组件
const requireComponents = require.context('../views/components', true, /\.vue/)
// 打印结果
// 遍历出每个组件的路径
requireComponents.keys().forEach(fileName => {
  // 组件实例
  const reqCom = requireComponents(fileName)
  // 截取路径作为组件名
  const reqComName =reqCom.name|| fileName.replace(/\.\/(.*)\.vue/,'$1')
  // 组件挂载
  Vue.component(reqComName, reqCom.default || reqCom)
})
```



### 2. 全局挂载函数导入



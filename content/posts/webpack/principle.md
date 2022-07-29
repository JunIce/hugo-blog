---
title: "webpack 打包原理"
date: 2022-05-04T05:59:58+08:00
categories: ["webpack"]
draft: false
---

# webpack



## 知识点



1. 通过入口文件循环遍历每个模块，把对应的模块交给对应的loader去处理, 所以webpack建议把你开发应用所有需要的资源都通过js去引用。

2. Loader机制是webpack最核心的机制，可以通过loader加载前端需要的任何资源

3. loader的执行顺序是从后往前
4. loader处理特殊类型资源文件的加载，plugin实现各种自动化的构建任务，扩展打包
5. loader只在模块加载环节使用，plugin覆盖全webpack生命周期





## 工作原理

1. webpack cli启动打包流程
2. 载入webpack核心模块，创建Compiler对象
3. 使用Compiler对象开始编译整个项目
4. 从入口文件开始，解析模块依赖，形成依赖关系树
5. 递归依赖树，将每个模块交给对应的Loader处理
6. 合并Loader处理完的结果，将结果打包输出到dist目录












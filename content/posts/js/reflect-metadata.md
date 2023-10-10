---
title: "reflect-metadata"
date: 2023-10-10T08:08:24+08:00
draft: true
tags: ["reflect-metadata", "reflect"]
categories: ["js"]
---



# reflect-metadata

反射元数据是对 Reflect 反射对象的补充，专门用来设置和读取元数据。


- Reflect.metadata：定义元数据的装饰器
- Reflect.defineMetadata：定义元数据
- Reflect.hasMetadata：判断元数据是否存在，会沿着原型链查找
- Reflect.hasOwnMetadata：判断 target 自身是否存在元数据
- Reflect.getMetadata：获取元数据，会沿着原型链查找
- Reflect.getOwnMetadata：只从 target 获取元数据
- Reflect.getMetadataKeys：获取所有元数据的 Key
- Reflect.getOwnMetadataKeys：只获取 target 身上的 key
- Reflect.deleteMetadata：删除元数据


## references

[https://juejin.cn/post/7060687817097084935](https://juejin.cn/post/7060687817097084935)
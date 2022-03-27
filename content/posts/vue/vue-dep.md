---
title: "Vue Dep 源码解读"
date: 2022-03-26T20:00:28+08:00
draft: true
tags: ["vue3"]
categories: ["vue"]
---



# dep



`@vue/reactivity` version `3.2.31`



## 用法



`dep`是vue `reacivity`在内部用作依赖收集的，其实它本质就是一个`Set`



`Set`的特性也都只读，就是`Set`中已经插入的元素不会被重复插入， 可以保证`Set`中元素的唯一性



和之前使用不通的是， vue中`dep`对于`Set`实例对象上加了两个属性， 用来表示是否是**新依赖**还是**已经依赖过**



## 源码



```typescript
export const createDep = (effects?: ReactiveEffect[]): Dep => {
  const dep = new Set<ReactiveEffect>(effects) as Dep
  dep.w = 0
  dep.n = 0
  return dep
}
```



其中**w**和**n**都是使用**位运算**的形式进行赋值

> wasTracked and newTracked maintain the status for several levels of effect tracking recursion. One bit per level is used to define whether the dependency was/is tracked.
>
> wasTracked 和 newTracked 维护多个级别的效果跟踪递归的状态。 每个级别使用一位来定义是否跟踪依赖项。 





其中`ref`和`reactive`在对变量进行响应式依赖收集时也是使用`deps`去保存当前变量依赖的函数

`effect`中在创建响应式副作用实例时，也有一个`deps`数组来保存依赖的变量










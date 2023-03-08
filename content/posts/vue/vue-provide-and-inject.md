---
title: "vue -- provide和inject原理"
date: 2023-03-08T15:26:32+08:00
tags: ["vue3", "provide", "inject"]
categories: ["vue"]
draft: false
---



# Vue3 provide和inject原理



`packages/runtime-core/src/apiInject.ts`

>   "version": "3.3.0"



`provide`和`inject`是用于组件间传递数据使用，在顶层组件使用provide，子组件使用inject获取值



## provide



provide 传入2个参数

- 第一个参数是key值，可以是字符串或者symbol类型
- 第二个参数是需要向下传递的值

```typescript
export function provide<T>(key: InjectionKey<T> | string | number, value: T) {
    let provides = currentInstance.provides
    // by default an instance inherits its parent's provides object
    // but when it needs to provide values of its own, it creates its
    // own provides object using parent provides object as prototype.
    // this way in `inject` we can simply look up injections from direct
    // parent and let the prototype chain do the work.
    // 默认情况下，实例继承其父对象的提供对象
    // 但是当它需要提供自己的价值时，它会创造自己的价值
    // 自己提供对象使用父提供对象作为原型。
    // 这样在 `inject` 中我们可以简单地从直接父级查找注入并让原型链完成工作。
    const parentProvides =
      currentInstance.parent && currentInstance.parent.provides
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    // TS doesn't allow symbol as index type
    provides[key as string] = value
}
```



这里有个点，当它需要提供自身的值时，把provides保存到当前组件上和当前组件的父组件上





## inject

根据key值获取provide中提供的值



- 参数1: 和provide中相互匹配的key值
- 参数2: 默认值（如果provide提供了值，则输出provide中的值，否则输出默认值）



```typescript
export function inject(
  key: InjectionKey<any> | string,
  defaultValue?: unknown,
  treatDefaultAsFactory = false
) {
  // fallback to `currentRenderingInstance` so that this can be called in
  // a functional component
  const instance = currentInstance || currentRenderingInstance
  if (instance) {
    // #2400
    // to support `app.use` plugins,
    // fallback to appContext's `provides` if the instance is at root
    const provides =
      instance.parent == null
        ? instance.vnode.appContext && instance.vnode.appContext.provides
        : instance.parent.provides

    if (provides && (key as string | symbol) in provides) {
      // TS doesn't allow symbol as index type
      return provides[key as string]
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue)
        ? defaultValue.call(instance.proxy)
        : defaultValue
    } else if (__DEV__) {
      warn(`injection "${String(key)}" not found.`)
    }
  } else if (__DEV__) {
    warn(`inject() can only be used inside setup() or functional components.`)
  }
}
```


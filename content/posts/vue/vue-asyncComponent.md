---
title: "Vue defineAsyncComponent源码解读"
date: 2023-01-28T08:35:59+08:00
draft: true
tags: ["vue3", "defineAsyncComponent"]
categories: ["vue"]
---





# Vue -- defineAsyncComponent源码解读



中定义了一个api用来加载异步组件

### demo code

```ts
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```



注册异步组件

```ts
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```



`defineAsyncComponent`签名中可以看到，传入的参数可以是一个Promise函数，也可以是一个对象

```typescript
export interface AsyncComponentOptions<T = any> {
  loader: AsyncComponentLoader<T>
  loadingComponent?: Component
  errorComponent?: Component
  delay?: number
  timeout?: number
  suspensible?: boolean
  onError?: (
    error: Error,
    retry: () => void,
    fail: () => void,
    attempts: number
  ) => any
}
```



## 源码



先看基本代码结构，源码中返回的其实是一个包裹的vue组件定义， 通过`defineComponent`返回一个新的组件，其中的原组件加载逻辑，在`setup`中重新实现了

```typescript
export function defineAsyncComponent(source) {
  if (isFunction(source)) {
    source = { loader: source }
  }
  //....
  
  let retries = 0
  const retry = () => {
    // ....
  }

  const load = (): Promise<ConcreteComponent> => {
    // ...
  }

  return defineComponent({
    name: 'AsyncComponentWrapper',

    __asyncLoader: load,

    get __asyncResolved() {
      return resolvedComp
    },

    setup() {
      // ...

      return () => {
        //...
      }
    }
  })
}
```



### setup

`setup`中最重要的一段，就是执行`load`方法，其中可以看出`load`返回的是一个`Promise`，在这个`Promise`中执行错误的捕获等

```typescript
load()
.then(() => {
  loaded.value = true
  if (instance.parent && isKeepAlive(instance.parent.vnode)) {
    //...
  }
})
.catch(err => {
  onError(err)
  error.value = err
})
```



### load



其中`thisRequest`是当前函数内定义的变量，`pendingRequest`是`defineAsyncComponent`运行周期内定义的变量

`loader`是我们传入的异步组件加载函数，也是一个`Promise`

`loader`先进行了`catch`错误捕获，其中如果用户定义了错误捕获函数，就会调用`onError`函数

`onError(err, userRetry, userFail, retries + 1)`  用户Error函数会给用户相关的错误信息、重试方法、以及重试的次数



```typescript
const load = (): Promise<ConcreteComponent> => {
    let thisRequest: Promise<ConcreteComponent>
    return (
      pendingRequest ||
      (thisRequest = pendingRequest =
        loader()
          .catch(err => {
            err = err instanceof Error ? err : new Error(String(err))
              // 错误捕获
            if (userOnError) {
              return new Promise((resolve, reject) => {
                const userRetry = () => resolve(retry())
                const userFail = () => reject(err)
                userOnError(err, userRetry, userFail, retries + 1)
              })
            } else {
              throw err
            }
          })
          .then((comp: any) => {
            //...
          }))
    )
  }
```



` if (thisRequest !== pendingRequest && pendingRequest) `

如果load函数多次执行了，只返回第一次执行的结果，这里可以学习官方对于多次执行的处理



```typescript
resolvedComp = comp
return comp
```



最终返回执行后的结果`comp`，并且对于`resolvedComp`



```typescript
if (
  comp &&
  (comp.__esModule || comp[Symbol.toStringTag] === 'Module')
) {
  comp = comp.default
}
```

对于ES module的处理，拿到default后重新赋值



### createInnerComp

创建内部vnode

```typescript
function createInnerComp(
  comp: ConcreteComponent,
  parent: ComponentInternalInstance
) {
  const { ref, props, children, ce } = parent.vnode
  const vnode = createVNode(comp, props, children)
  // ensure inner component inherits the async wrapper's ref owner
  vnode.ref = ref
  // pass the custom element callback on to the inner comp
  // and remove it from the async wrapper
  vnode.ce = ce
  delete parent.vnode.ce

  return vnode
}
```

这里最重要的就是对于ref指向的重写， 保证外部定义的ref，都是指向我们定义的组件

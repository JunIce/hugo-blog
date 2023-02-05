---
title: "Vue setup实现源码解读"
date: 2023-01-31T09:21:16+08:00
draft: true
tags: ["vue3", "setup"]
categories: ["vue"]
---







# vue setup实现源码解读



`@vue/runtime-core` version `3.2.45`



## 源码

主要函数执行逻辑

```typescript
mountComponent -> setupComponent -> setupStatefulComponent -> callWithErrorHandling -> handleSetupResult -> finishComponentSetup
```



我们都知道vue中使用虚拟dom来映射到真实dom的

即 **虚拟dom -> 真实dom**

vue3中在vue2的基础上，添加了一个setup熟悉，原本我们在vue2中的options的写法，都可以无缝转换到setup内进行表达



这次我就来看一下setup内部的实现逻辑，以及setup中相关声明周期勾子的实现



虚拟dom也是使用一个对象来表示当前组件的结构 ，虚拟dom到真实的dom的过程中肯定会经历到mount的过程，所以我们从mount来看



### mountComponent



```typescript
const mountComponent: MountComponentFn = (
    initialVNode,
    container,
    anchor,
    parentComponent,
    parentSuspense,
    isSVG,
    optimized
  ) => {
    // ....

    // resolve props and slots for setup context
    if (!(__COMPAT__ && compatMountInstance)) {
      // 这里就会走到setup component
      setupComponent(instance)
    }

    // setup 中的副作用执行
    setupRenderEffect(
      instance,
      initialVNode,
      container,
      anchor,
      parentSuspense,
      isSVG,
      optimized
    )
  }
```



### setupComponent

```typescript

export function setupComponent(
  instance: ComponentInternalInstance,
  isSSR = false
) {
  isInSSRComponentSetup = isSSR

  const { props, children } = instance.vnode
  const isStateful = isStatefulComponent(instance)
  // 初始化props
  initProps(instance, props, isStateful, isSSR)
  // 初始化slots
  initSlots(instance, children)

  const setupResult = isStateful
  	// 执行setup函数
    ? setupStatefulComponent(instance, isSSR)
    : undefined
  isInSSRComponentSetup = false
  return setupResult
}
```

初始化props和slots在执行setup函数之前



### setupStatefulComponent

```typescript
function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
  const Component = instance.type as ComponentOptions

  // 0. create render proxy property access cache
  instance.accessCache = Object.create(null)
  // 1. create public instance / render proxy
  // also mark it raw so it's never observed
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers))
  
  // 2. call setup()
  const { setup } = Component
  if (setup) {
    const setupContext = (instance.setupContext =
      setup.length > 1 ? createSetupContext(instance) : null)

    setCurrentInstance(instance)
    pauseTracking()
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      ErrorCodes.SETUP_FUNCTION,
      [__DEV__ ? shallowReadonly(instance.props) : instance.props, setupContext]
    )
    resetTracking()
    unsetCurrentInstance()

    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance)
       if (__FEATURE_SUSPENSE__) {
        // async setup returned Promise.
        // bail here and wait for re-entry.
        instance.asyncDep = setupResult
        
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR)
    }
  } else {
    finishComponentSetup(instance, isSSR)
  }
}
```


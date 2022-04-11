---
title: "Vue mountComponent函数解读"
date: 2022-04-10T14:53:37+08:00
draft: true
tags: ["vue3"]
categories: ["vue"]
---





# vue mountComponent函数解读



`packages/runtime-core/src/renderer.ts`



>  "version": "3.2.31"



## mountComponent入口



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
    // 2.x compat may pre-create the component instance before actually
    // mounting
    // 兼容vue2
    const instance: ComponentInternalInstance =
      compatMountInstance ||
      (initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense
      ))

    // inject renderer internals for keepAlive
    // 组件为keepalive时会定义一个renderer，其实就是一系列渲染方法的对象
    if (isKeepAlive(initialVNode)) {
      ;(instance.ctx as KeepAliveContext).renderer = internals
    }

    // resolve props and slots for setup context
    //if (!(__COMPAT__ && compatMountInstance)) {
      // setup 勾子挂载
      // setup优先级很高
      setupComponent(instance)
    //}
	
	// 执行setup的副作用函数
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

`setup`中会对props和slots进行初始化

```typescript
export function setupComponent(
  instance: ComponentInternalInstance,
  isSSR = false
) {
  isInSSRComponentSetup = isSSR

  const { props, children } = instance.vnode
  const isStateful = isStatefulComponent(instance)
  initProps(instance, props, isStateful, isSSR)
  initSlots(instance, children)

  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined
  isInSSRComponentSetup = false
  return setupResult
}
```





#### setupStatefulComponent

1. 创建一个空对象，从字面意思上看是用作cache
2. 对上下文的内部属性进行代理， （handler get方法内部有个优化，运行时时创建了一个accessCache 对象，保存了对应的key值，减少重复使用hasOwnProperty）
3. 如果组件有自己的`setup`，则对应执行
   1. `createSetupContext`在内部会构建一个对象， 包含`emits`，`props`， `attrs`，`slots`
   2. 执行`setup`函数，并拿到对应的结果
   3. 判断是否是`promise`
      1. 不是`promise`，也就是我们经常使用的那种返回一个对象的形式，最终会执行到`handleSetupResult -> finishComponentSetup`
4. 没有`setup`则执行`finishComponentSetup`



```typescript
function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
  const Component = instance.type as ComponentOptions

  // 0. create render proxy property access cache
  //
  instance.accessCache = Object.create(null)
  // 1. create public instance / render proxy
  // also mark it raw so it's never observed
  // 单纯代理，不走响应式
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
    } else {
      handleSetupResult(instance, setupResult, isSSR)
    }
  } else {
    finishComponentSetup(instance, isSSR)
  }
}
```



#### finishComponentSetup



这个函数主要作用其实是判断实例上有没有`render`函数，没有的话会进行运行时编译



最重要的一部就是把组件的render赋值到instance的render上





### setupRenderEffect

这个是执行到渲染的主逻辑了

1. 内部实例化了一个`ReactiveEffect`，并赋值给`instance.update`。  `run`函数就是执行的组件更新逻辑，`scheduler`同样执行的是这个，只不过会放入到队列中去了

2. `update()`执行其实就是执行的挂载动作了

   

```typescript
const setupRenderEffect: SetupRenderEffectFn = (
    instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    isSVG,
    optimized
  ) => {
	const componentUpdateFn = () => {
        // .....
    }
    // create reactive effect for rendering
    const effect = (instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(instance.update),
      instance.scope // track it in component's effect scope
    ))

    const update = (instance.update = effect.run.bind(effect) as SchedulerJob)
    update.id = instance.uid
    // allowRecurse
    // #1801, #2043 component render effects should allow recursive updates
    toggleRecurse(instance, true)

    update()
  }
```



#### componentUpdateFn



分为两种情况

1. 初次挂载
2. 更新

区分是不是第一次挂载，用的`isMounted`参数作为区分



初次挂载的情况

1. 执行自身的`beforeMounted`勾子
2. 执行parent的回调勾子
3. 调用组件的`render`函数，生成对应的组件dom tree
4. 走`patch`函数，第1个参数为null，其实就是insert
5. 把实例对象赋值给`initialVNode.el = subTree.el`
6. 执行自身的mounted勾子
7. 执行父组件的回调勾子
8. `isMounted`设置为`true`



更新

一共两种更新

1. 自己内部状态发生变化
2. 由父组件更新触发的更新

执行流程

1. 对next进行重新赋值（next这里是vnode，即下一次渲染的vnode）
2. 执行beforeUpdate勾子
3. 生成下一次渲染的dom tree
4. 走`patch`函数，这里会有对应两次的dom tree
5. 执行updated勾子
6. 执行父组件的update勾子回调



```typescript
/**
 * 组件更新逻辑
 */
const componentUpdateFn = () => {
  if (!instance.isMounted) {
    let vnodeHook: VNodeHook | null | undefined
    const { el, props } = initialVNode
    // beforeMounted, mounted
    const { bm, m, parent } = instance
    const isAsyncWrapperVNode = isAsyncWrapper(initialVNode)

    toggleRecurse(instance, false)
    // beforeMount hook
    if (bm) {
      invokeArrayFns(bm)
    }
    // onVnodeBeforeMount
    // 执行parentd的勾子函数
    if (
      !isAsyncWrapperVNode &&
      (vnodeHook = props && props.onVnodeBeforeMount)
    ) {
      invokeVNodeHook(vnodeHook, parent, initialVNode)
    }
    // 兼容vue2beforeMount
    if (
      __COMPAT__ &&
      isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
    ) {
      instance.emit('hook:beforeMount')
    }
    // effect.allowRecurse = effect.allowRecurse = true
    toggleRecurse(instance, true)

    if (el && hydrateNode) {
      // vnode has adopted host node - perform hydration instead of mount.
      const hydrateSubTree = () => {

        instance.subTree = renderComponentRoot(instance)

        hydrateNode!(
          el as Node,
          instance.subTree,
          instance,
          parentSuspense,
          null
        )
      }

      if (isAsyncWrapperVNode) {
        ;(initialVNode.type as ComponentOptions).__asyncLoader!().then(
          // note: we are moving the render call into an async callback,
          // which means it won't track dependencies - but it's ok because
          // a server-rendered async wrapper is already in resolved state
          // and it will never need to change.
          () => !instance.isUnmounted && hydrateSubTree()
        )
      } else {
        hydrateSubTree()
      }
    } else {

      const subTree = (instance.subTree = renderComponentRoot(instance))
      // patch null 其实就是insert
      patch(
        null,
        subTree,
        container,
        anchor,
        instance,
        parentSuspense,
        isSVG
      )

      initialVNode.el = subTree.el
    }
    // mounted hook
    // 入栈
    if (m) {
      queuePostRenderEffect(m, parentSuspense)
    }
    // onVnodeMounted
    // parent 勾子入栈
    if (
      !isAsyncWrapperVNode &&
      (vnodeHook = props && props.onVnodeMounted)
    ) {
      const scopedInitialVNode = initialVNode
      queuePostRenderEffect(
        () => invokeVNodeHook(vnodeHook!, parent, scopedInitialVNode),
        parentSuspense
      )
    }
    if (
      __COMPAT__ &&
      isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
    ) {
      queuePostRenderEffect(
        () => instance.emit('hook:mounted'),
        parentSuspense
      )
    }

    // activated hook for keep-alive roots.
    // #1742 activated hook must be accessed after first render
    // since the hook may be injected by a child keep-alive
    // keep alive activited 勾子入栈
    if (initialVNode.shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
      instance.a && queuePostRenderEffect(instance.a, parentSuspense)
      if (
        __COMPAT__ &&
        isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
      ) {
        queuePostRenderEffect(
          () => instance.emit('hook:activated'),
          parentSuspense
        )
      }
    }
    // instance mounted 变量写入
    instance.isMounted = true



    // #2458: deference mount-only object parameters to prevent memleaks
    initialVNode = container = anchor = null as any
  } else {
    // updateComponent
    // This is triggered by mutation of component's own state (next: null)
    // OR parent calling processComponent (next: VNode)
    // 挂载后组件更新
    let { next, bu, u, parent, vnode } = instance
    let originNext = next
    let vnodeHook: VNodeHook | null | undefined


    // Disallow component effect recursion during pre-lifecycle hooks.
    toggleRecurse(instance, false)
    if (next) {
      next.el = vnode.el
      // 存在next情况下，预渲染
      updateComponentPreRender(instance, next, optimized)
    } else {
      next = vnode
    }

    // beforeUpdate hook
    if (bu) {
      invokeArrayFns(bu)
    }
    // onVnodeBeforeUpdate
    if ((vnodeHook = next.props && next.props.onVnodeBeforeUpdate)) {
      invokeVNodeHook(vnodeHook, parent, next, vnode)
    }
    if (
      __COMPAT__ &&
      isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
    ) {
      instance.emit('hook:beforeUpdate')
    }
    toggleRecurse(instance, true)


    const nextTree = renderComponentRoot(instance)

    const prevTree = instance.subTree
    instance.subTree = nextTree

    patch(
      prevTree,
      nextTree,
      // parent may have changed if it's in a teleport
      hostParentNode(prevTree.el!)!,
      // anchor may have changed if it's in a fragment
      getNextHostNode(prevTree),
      instance,
      parentSuspense,
      isSVG
    )
    if (__DEV__) {
      endMeasure(instance, `patch`)
    }
    next.el = nextTree.el
    if (originNext === null) {
      // self-triggered update. In case of HOC, update parent component
      // vnode el. HOC is indicated by parent instance's subTree pointing
      // to child component's vnode
      updateHOCHostEl(instance, nextTree.el)
    }
    // updated hook
    if (u) {
      queuePostRenderEffect(u, parentSuspense)
    }
    // onVnodeUpdated
    if ((vnodeHook = next.props && next.props.onVnodeUpdated)) {
      queuePostRenderEffect(
        () => invokeVNodeHook(vnodeHook!, parent, next!, vnode),
        parentSuspense
      )
    }
    if (
      __COMPAT__ &&
      isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
    ) {
      queuePostRenderEffect(
        () => instance.emit('hook:updated'),
        parentSuspense
      )
    }
  }
}
```


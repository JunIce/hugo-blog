---
title: "vue3 内置Transition组件"
date: 2023-09-15T15:15:41+08:00
tags: ["Transition", "vue3"]
categories: ["vue"]
draft: false
---





# vue3 内置Transition组件





## Transition



`Transition`在vue源码中是一个高阶函数，为了兼容不同平台，这里把`dom`相关的实现都留在`runtime-dom`包里面，核心代码都是在`runtime-core`里面



```ts
export const Transition: FunctionalComponent<TransitionProps> = (
  props,
  { slots }
) => h(BaseTransition, resolveTransitionProps(props), slots)
```



### resolveTransitionProps

解析dom相关的props，并最终返回传递给BaseTransition的props



- 递归对象，把相关的值赋值到新对象上

```ts
const baseProps: BaseTransitionProps<Element> = {}
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      ;(baseProps as any)[key] = (rawProps as any)[key]
    }
  }
```



- 组装相关的class

```ts
  const {
    name = 'v',
    type,
    duration,
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    appearFromClass = enterFromClass,
    appearActiveClass = enterActiveClass,
    appearToClass = enterToClass,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`
  } = rawProps
```



- 实现相关生命周期的代码

```ts
extend(baseProps, {
    onBeforeEnter(el) {
      // enter
    },
    onBeforeAppear(el) {
      // appear
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el: Element & { _isLeaving?: boolean }, done) {
      // leave
    },
    onEnterCancelled(el) {
      // entercancel
    },
    onAppearCancelled(el) {
      // appear cancel
    },
    onLeaveCancelled(el) {
      // leave cancel
    }
  } as BaseTransitionProps<Element>)
```

这里基类只需要调用，不需要管如何实现



### makeEnterHook

makeEnterHook是一个高阶函数，这里对勾子函数做了进一步封装

在下一帧的时候操作元素上的class

```ts
  const makeEnterHook = (isAppear: boolean) => {
    return (el: Element, done: () => void) => {
      const hook = isAppear ? onAppear : onEnter
      const resolve = () => finishEnter(el, isAppear, done)
      callHook(hook, [el, resolve])
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass)
        if (__COMPAT__ && legacyClassEnabled) {
          const legacyClass = isAppear
            ? legacyAppearFromClass
            : legacyEnterFromClass
          if (legacyClass) {
            removeTransitionClass(el, legacyClass)
          }
        }
        addTransitionClass(el, isAppear ? appearToClass : enterToClass)
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve)
        }
      })
    }
  }
```



### whenTransitionEnds

这里触发回调函数，如果设置了变化时间，通过setTimeout进行调用



```ts
const id = (el._endId = ++endId)
const resolveIfNotStale = () => {
  if (id === el._endId) {
    resolve()
  }
}

if (explicitTimeout) {
  return setTimeout(resolveIfNotStale, explicitTimeout)
}
```

监听dom元素动画事件

```ts

  const endEvent = type + 'end'
  let ended = 0
  const end = () => {
    el.removeEventListener(endEvent, onEnd)
    resolveIfNotStale()
  }
  const onEnd = (e: Event) => {
    if (e.target === el && ++ended >= propCount) {
      end()
    }
  }
  setTimeout(() => {
    if (ended < propCount) {
      end()
    }
  }, timeout + 1)
  el.addEventListener(endEvent, onEnd)
```





## BaseTransitionImpl



遍历出所有的子元素，并且把domtree 数组 平铺

```ts
      const children =
        slots.default && getTransitionRawChildren(slots.default(), true)
```



找到第一个非注释的节点

```ts
      let child: VNode = children[0]
      if (children.length > 1) {
        let hasFound = false
        // locate first non-comment child
        for (const c of children) {
          if (c.type !== Comment) {
            child = c
            hasFound = true
            if (!__DEV__) break
          }
        }
      }
```



设置vnode的transition Hook,直接挂在到vnode到transition属性上

```ts
export function setTransitionHooks(vnode: VNode, hooks: TransitionHooks) {
  if (vnode.shapeFlag & ShapeFlags.COMPONENT && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks)
  } else if (__FEATURE_SUSPENSE__ && vnode.shapeFlag & ShapeFlags.SUSPENSE) {
    vnode.ssContent!.transition = hooks.clone(vnode.ssContent!)
    vnode.ssFallback!.transition = hooks.clone(vnode.ssFallback!)
  } else {
    vnode.transition = hooks
  }
}
```






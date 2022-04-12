---
title: "Vue Watch"
date: 2022-04-10T09:14:44+08:00
draft: true
tags: ["vue3"]
categories: ["vue"]
---


# Vue watch



>  "version": "3.2.31"



## 用法



`watch`可以在组件中监听响应式数据的变化，以此调用回调函数



```typescript
const state = reactive({ count: 0 })
let dummy
watch(
  () => state.count,
  (count, prevCount) => {
    dummy = [count, prevCount]
    // assert types
    count + 1
    if (prevCount) {
      prevCount + 1
    }
  }
)
state.count++
await nextTick()
expect(dummy).toMatchObject([1, 0])
```





## 源码解析



watch可以传入3个参数

- 需要监听的对象， 可以是函数，数组，响应式数据
- 回调函数
- 调用触发时机的配置



```typescript
function watch<T = any, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  cb: any,
  options?: WatchOptions<Immediate>
){
// ....
}
```



### doWatch



第一步， 根据不同的监听对象，构造出一个`getter`函数

```typescript
 // 判断source值的类型， 并以此初始化出一个getter函数
  if (isRef(source)) {
    getter = () => source.value
    forceTrigger = isShallow(source)
  } else if (isReactive(source)) {
    getter = () => source
    deep = true
  } else if (isArray(source)) {
    // 数组
    isMultiSource = true
    forceTrigger = source.some(isReactive)
    getter = () =>
      source.map(s => {
        if (isRef(s)) {
          return s.value
        } else if (isReactive(s)) {
          return traverse(s)
        } else if (isFunction(s)) {
          return callWithErrorHandling(s, instance, ErrorCodes.WATCH_GETTER)
        } else {
          __DEV__ && warnInvalidSource(s)
        }
      })
  } else if (isFunction(source)) {
    // 函数
    if (cb) {
      // getter with cb
      getter = () =>
        callWithErrorHandling(source, instance, ErrorCodes.WATCH_GETTER)
    } else {
      // no cb -> simple effect
      getter = () => {
        if (instance && instance.isUnmounted) {
          return
        }
        if (cleanup) {
          cleanup()
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          ErrorCodes.WATCH_CALLBACK,
          [onCleanup]
        )
      }
    }
  } else {
    getter = NOOP
    __DEV__ && warnInvalidSource(source)
  }
```





第2步。监听的重点

```typescript
  // 创建一个effect对象
  const effect = new ReactiveEffect(getter, scheduler)
```

内部实例化出一个effect对象， fn则是getter函数

```typescript
let scheduler: EffectScheduler
  // 根据不同的参数创建不同的scheduler函数
  if (flush === 'sync') {
    scheduler = job as any // the scheduler function gets called directly
  } else if (flush === 'post') {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense)
  } else {
    // default: 'pre'
    // 默认为pre
    scheduler = () => {
      if (!instance || instance.isMounted) {
        // 插入到pre队列中去
        queuePreFlushCb(job)
      } else {
        // with 'pre' option, the first call must happen before
        // the component is mounted so it is called synchronously.
        // pre下需要在组件mounted之前调用，所以这里直接调用了
        job()
      }
    }
  }
```

`scheduler`函数则是配置不同的调用时机



- 第3块，初始化运行

```typescript
// initial run
  if (cb) {
    if (immediate) {
      // 初次渲染
      job()
    } else {
      // 保存旧值
      oldValue = effect.run()
    }
  } else if (flush === 'post') {
    queuePostRenderEffect(
      effect.run.bind(effect),
      instance && instance.suspense
    )
  } else {
    effect.run()
  }
```



如果配置了`immediate`，则立即执行`job`函数

否则允许`run`函数，目的是拿到运行后的值





`flush == "post"`

这里其实是用作兼容`watchEffect`这个api的，`watchEffect`最终也会走到这个`doWatch`函数内部



```typescript
export function watchEffect(
  effect: WatchEffect,
  options?: WatchOptionsBase
): WatchStopHandle {
  return doWatch(effect, null, options)
}
```


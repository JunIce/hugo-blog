---
title: "Vue Scheduler 源码解读"
date: 2022-03-30T10:51:07+08:00
draft: true
---







# scheduler



> `vue` **v3.2.31**



`scheduler`是`vue`中事件触发调度系统

有三种容器，其实就是数组

- `queue`事件队列
- `preFlushCbs`事件队列
- `postFlushCbs`事件队列



### 执行流程

1. 每个job都会有个id，执行之前都会根据id排序，正序排列
2. 先执行pre队列，pre队列中可能会产生其他插入到pre的函数，所以会循环调用自身，直至情况
3. 再遍历`queue`队列，直至结束
4. `finally`中执行`post`队列，直至清空





### flushJobs

```typescript
function flushJobs(seen?: CountMap) {
  isFlushPending = false
  isFlushing = true
  if (__DEV__) {
    seen = seen || new Map()
  }

  // 执行pre callback
  flushPreFlushCbs(seen)

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child so its render effect will have smaller
  //    priority number)
  // 2. If a component is unmounted during a parent component's update,
  //    its update can be skipped.
  // 正序排列
  queue.sort((a, b) => getId(a) - getId(b))

  const check = __DEV__
    ? (job: SchedulerJob) => checkRecursiveUpdates(seen!, job)
    : NOOP

  try {
    // 循环执行job
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex]
      if (job && job.active !== false) {
       
        // console.log(`running:`, job.id)
        callWithErrorHandling(job, null, ErrorCodes.SCHEDULER)
      }
    }
  } finally {
    flushIndex = 0
    queue.length = 0

    flushPostFlushCbs(seen)

    isFlushing = false
    currentFlushPromise = null
    // some postFlushCb queued jobs!
    // keep flushing until it drains.
    // 回调之后可能还有其他回调
    if (
      queue.length ||
      pendingPreFlushCbs.length ||
      pendingPostFlushCbs.length
    ) {
      flushJobs(seen)
    }
  }
}
```





## nextTick



`nextTick`在`vue`中就是把事件放到下个事件循环中执行，返回一个`Promise`对象



### 用法

```typescript

  const calls: string[] = []
  const cb1 = () => {
    calls.push('cb1')
    // cb2 will be executed after cb1 at the same tick
    queuePreFlushCb(cb2)
  }
  const cb2 = () => {
    calls.push('cb2')
  }
  queuePreFlushCb(cb1)

  await nextTick()
  expect(calls).toEqual(['cb1', 'cb2'])

```



### 源码

内部很简单，其实就是用`Promise.then`实现

```typescript
export function nextTick<T = void>(
  this: T,
  fn?: (this: T) => void
): Promise<void> {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
```






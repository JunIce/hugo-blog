---
title: "Vue3.4.0之后 reactive 对于Array原型方法的处理（arrayInstrumentations）"
date: 2024-08-28T17:22:30+08:00
draft: true
tags: ["vue3"]
categries: ["vue"]
---


# Vue3.4.0之后 reactive 对于Array原型方法的处理（arrayInstrumentations）


版本
`version: 3.5.0-beta.3`

## baseHandler

baseHandler中盘点对象是否是一个Array, 如果是array, 根据对应的key从`arrayInstrumentations`对象中索引对应的方法


```ts
    const targetIsArray = isArray(target)

    if (!isReadonly) {
      let fn: Function | undefined
      if (targetIsArray && (fn = arrayInstrumentations[key])) {
        return fn
      }
      if (key === 'hasOwnProperty') {
        return hasOwnProperty
      }
    }
```

这里`arrayInstrumentations`是一个对象

也是3.4版本之后才加上去的


## arrayInstrumentations

输出一个对象，这里对原始的Array上的方法进行单独处理了
对于不同的数组原型方法捕获的细粒度进行细化，这里可以学习如何重写原型方法

包括以下方法：
- entries,values // iterator
- every, filter, find, findIndex, findLast, findLastIndex, forEach, map,some, // apply
- includes, indexOf, , lastIndexOf,  // searchProxy
- pop, push,  shift, splice, unshift  // 不需要进行数组跟踪的方法 noTracking
- toReversed, toSorted, tpSpliced,join,concat
- reduce, reduceRight,


### apply

apply方法中对于数组元素

```typescript
function apply(
  self: unknown[],
  method: ArrayMethods,
  fn: (item: unknown, index: number, array: unknown[]) => unknown,
  thisArg?: unknown,
  wrappedRetFn?: (result: any) => unknown,
  args?: IArguments,
) {
  // 跟踪原数组，这里只会跟踪1次
  const arr = shallowReadArray(self)
  const needsWrap = arr !== self && !isShallow(self)
  // @ts-expect-error our code is limited to es2016 but user code is not
  const methodFn = arr[method]
  // 如果不是原生数组方法，直接调用，如果原数组是响应式的，结果转换成响应式
  if (methodFn !== arrayProto[method]) {
    const result = methodFn.apply(arr, args)
    return needsWrap ? toReactive(result) : result
  }

  let wrappedFn = fn
  if (arr !== self) {
    if (needsWrap) {
	  // 如果是响应式的，每个元素也转换成响应式
      wrappedFn = function (this: unknown, item, index) {
        return fn.call(this, toReactive(item), index, self)
      }
    } else if (fn.length > 2) {
      wrappedFn = function (this: unknown, item, index) {
        return fn.call(this, item, index, self)
      }
    }
  }
  // 调用数字原型方法
  const result = methodFn.call(arr, wrappedFn, thisArg)
  // 结果是否需要包裹方法处理
  return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result
}
```


### 重新迭代方法

这里重写了数组上的iterable方法
把初始的next方法赋值到_next上，重写next方法，内部将next执行的value进行处理

```typescript
function iterator(
  self: unknown[],
  method: keyof Array<unknown>,
  wrapValue: (value: any) => unknown,
) {

  // note that taking ARRAY_ITERATE dependency here is not strictly equivalent
  // to calling iterate on the proxified array.
  // creating the iterator does not access any array property:
  // it is only when .next() is called that length and indexes are accessed.
  // pushed to the extreme, an iterator could be created in one effect scope,
  // partially iterated in another, then iterated more in yet another.
  // given that JS iterator can only be read once, this doesn't seem like
  // a plausible use-case, so this tracking simplification seems ok.

  const arr = shallowReadArray(self)
  const iter = (arr[method] as any)() as IterableIterator<unknown> & {
    _next: IterableIterator<unknown>['next']
  }

  if (arr !== self && !isShallow(self)) {
    iter._next = iter.next
    // 重写迭代方法，这里先
    iter.next = () => {
      const result = iter._next()
      if (result.value) {
        // 处理迭代器的值
        result.value = wrapValue(result.value)
      }
      return result
    }
  }

  return iter
}
```


### 不需要捕获的数组方法

进一步优化数组原型方法，不需要进行跟踪的方法，直接调用原型方法

```typescript
function noTracking(
  self: unknown[],
  method: keyof Array<any>,
  args: unknown[] = [],
) {

  pauseTracking()
  startBatch()
  const res = (toRaw(self) as any)[method].apply(self, args)
  endBatch()
  resetTracking()
  return res
}
```


3.4之前版本原来的代码：

```ts
const arrayInstrumentations: Record<string, Function> = {}

// instrument identity-sensitive Array methods to account for possible reactive
// values
;(['includes', 'indexOf', 'lastIndexOf'] as const).forEach(key => {

  const method = Array.prototype[key] as any
  arrayInstrumentations[key] = function(this: unknown[], ...args: unknown[]) {
    const arr = toRaw(this)
    for (let i = 0, l = this.length; i < l; i++) {
      track(arr, TrackOpTypes.GET, i + '')
    }

    // we run the method using the original args first (which may be reactive)
    const res = method.apply(arr, args)
    if (res === -1 || res === false) {
      // if that didn't work, run it again using raw values.
      return method.apply(arr, args.map(toRaw))
    } else {
      return res
    }
  }

})

// instrument length-altering mutation methods to avoid length being tracked
// which leads to infinite loops in some cases (#2137)
;(['push', 'pop', 'shift', 'unshift', 'splice'] as const).forEach(key => {
  const method = Array.prototype[key] as any
  arrayInstrumentations[key] = function(this: unknown[], ...args: unknown[]) {
    pauseTracking()
    const res = method.apply(this, args)
    resetTracking()
    return res
  }
})
```


## references

[原始PR - arrayInstrumentations](https://github.com/vuejs/core/pull/9511)
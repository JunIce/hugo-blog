---
title: "前端memo的实现"
date: 2023-09-03T10:18:32+08:00
tags: ["memo"]
categories: ["js"]
draft: false
---


# 前端memo的实现



memo是react中的缓存实现

当memo中有一个依赖发生更新时，就会调用回调函数



memo这里用一个闭包进行实现

主函数体中储存了一个依赖数组，一个结果缓存

返回一个闭包函数

闭包函数中进行依赖比对，如果结果发生变化，就会执行回调函数，否则返回之前的值



```typescript
export function memo<TDeps extends readonly any[], TResult>(
  getDeps: () => [...TDeps],
  fn: (...args: NoInfer<[...TDeps]>) => TResult,
  opts: {
    key: any
    debug?: () => any
    onChange?: (result: TResult) => void
  }
): () => TResult {
  let deps: any[] = []
  let result: TResult | undefined

  return () => {
    let depTime: number
    if (opts.key && opts.debug) depTime = Date.now()

    const newDeps = getDeps()

    const depsChanged =
      newDeps.length !== deps.length ||
      newDeps.some((dep: any, index: number) => deps[index] !== dep)

    if (!depsChanged) {
      return result!
    }

    deps = newDeps

    let resultTime: number
    if (opts.key && opts.debug) resultTime = Date.now()

    result = fn(...newDeps)
    opts?.onChange?.(result)

    return result!
  }
}

```


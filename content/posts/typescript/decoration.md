---
title: "typescript 装饰器"
date: 2023-08-21T22:06:59+08:00
tags: ["typescript"]
categories: ["typescript"]
draft: false
---



# typescript 装饰器

```ts
declare type MethodDecorator = <T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void

type VoidFn = ((...args: any[]) => void) | ((...args: any[]) => Promise<void>)
export const Performance = () => (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<VoidFn>) => {
  const originalMethod = descriptor.value
  if (originalMethod) {
    descriptor.value = function (this: any, ...args: any[]) {
      const handleError = (error: any) => {
        console.error(error)
        // etc.
      }
      const t1 = window.performance.now()
      try {
        const result: any = originalMethod.apply(this, args)
        const t2 = window.performance.now()
        console.log(`Performance time: ${t2 - t1}`)
        // @ts-ignore
        if (result && result instanceof Promise) {
          return result.catch(handleError)
        }
      } catch (error) {
        handleError(error)
      }
    }
    return descriptor
  }
}
```

---
title: "Vue Reactive 源码解读"
date: 2022-03-24T09:21:16+08:00
draft: true
tags: ["vue3"]
categories: ["vue"]
---







# reactive



`@vue/reactivity` version `3.2.31`



## 源码



源码入口

### reactive

```typescript
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (isReadonly(target)) {
    return target
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  )
}
```



这里如果想去监听一个已经**代理过**的**只读**对象， 会直接返回原对象



### createReactiveObject



```typescript
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  // 不是对象，返回本身
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // 目标已经被代理过，直接返回
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
  // 代理池中已经有相关对象的代理值，返回代理值，这里是优化，避免同一个对象多次代理
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // 判断白名单
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  // 代理Proxy
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  // 塞入代理池
  proxyMap.set(target, proxy)
  return proxy
}
```



### baseHandlers - mutableHandlers



这里以`mutableHandlers`为例， 大多数常规对象都是走的这个



```
export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
}
```



对象重写了上面几个方法， get、set是我们研究的重点



#### createGetter

```typescript
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    if (key === ReactiveFlags.IS_REACTIVE) {// key == 响应式flag
      return !isReadonly // 非只读
    } else if (key === ReactiveFlags.IS_READONLY) {// key == 只读flag
      return isReadonly // 只读
    } else if (key === ReactiveFlags.IS_SHALLOW) { // key == 浅对象flag
      return shallow // 是否是浅对象
    } else if (
      key === ReactiveFlags.RAW && // key == 原始值flag
      receiver === 
        (isReadonly
          ? shallow
            ? shallowReadonlyMap
            : readonlyMap
          : shallow
          ? shallowReactiveMap
          : reactiveMap
        ).get(target)
    ) {
      return target
    }

    // 对象是数组的情况下，走arrayInstrumentations读取数组
    const targetIsArray = isArray(target)

    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver)
    }

    // Reflect 映射对象
    const res = Reflect.get(target, key, receiver)

    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res
    }

    // 不是只读的情况下，收集依赖
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }

    // 浅比较，返回代理对象
    if (shallow) {
      return res
    }

    // ref对象，返回.value值
    if (isRef(res)) {
      // ref unwrapping - does not apply for Array + integer key.
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key)
      return shouldUnwrap ? res.value : res
    }

    // 对象的情况，不是只读，走递归
    if (isObject(res)) {
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}
```



`createGetter`返回的是一个闭包函数，方便函数做通用化处理

上面有一大段都是对特定的`key`值做的判断，对于读源码抓重点信息其实都是干扰



最重要的一段就是

```typescript
Reflect.get(target, key, receiver)
```

这里通过`Reflect`去读取`receiver`中对应的`key`的值







#### createSetter

```typescript
function createSetter(shallow = false) {
  return function set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object
  ): boolean {
    let oldValue = (target as any)[key]
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false
    }
    // shallow = false && 不是只读
    if (!shallow && !isReadonly(value)) {
      // 不是shallow
      if (!isShallow(value)) {
        // 拿到新值和旧值的原始值
        value = toRaw(value)
        oldValue = toRaw(oldValue)
      }
      // 不是数组 && 旧值是ref && 新值不是ref
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value
        return true
      }
    } else {
      // in shallow mode, objects are set as-is regardless of reactive or not
      // shallow 模式下， 对象不管是不是响应式都按原样设置
    }

    // 原对象中是否有key
    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key)
    
    // reflect 设置对象映射
    const result = Reflect.set(target, key, value, receiver)

    // don't trigger if target is something up in the prototype chain of original
    // 响应式回调相关， effect相关的副作用， 只有对象和代理对象相等的情况下才执行副作用
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) {
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
    }
    return result
  }
}
```

`createSetter`也是返回的一个闭包函数



- 拿到原始的新值和旧值

- 对值的类型做判断

- 通过`Reflect`去设置目标对象的key和value

```typescript
Reflect.set(target, key, value, receiver)
```

- 触发依赖函数的响应回调（effect相关的）

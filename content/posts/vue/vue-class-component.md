---
title: "Vue -- vue-class-component源码"
date: 2023-09-01T08:49:34+08:00
tags: ["vue3", "vue-class-component"]
categories: ["vue"]
draft: false
---


# vue-class-component源码



入口`Component`装饰器函数

这里执行了`componentFactory`这个工厂函数

```typescript
function Component (options: ComponentOptions<Vue> | VueClass<Vue>): any {
  if (typeof options === 'function') {
    return componentFactory(options)
  }
  return function (Component: VueClass<Vue>) {
    return componentFactory(Component, options)
  }
}
```

同时这个函数还有个静态属性，用于注册全局钩子函数

```typescript
Component.registerHooks = function registerHooks (keys: string[]): void {
  $internalHooks.push(...keys)
}
```

### componentFactory

- 1. 拿到原型

>  const proto = Component.prototype

这里会拿到class定义的类上面的所有原型属性

- 2. 循环处理

```typescript
  Object.getOwnPropertyNames(proto).forEach(function (key) {
    // ...
  })
```
`Object.getOwnPropertyNames`会拿到所有属性key组成的数组，通过forEach进行遍历

- 2.1 处理钩子函数

```typescript
    // hooks
    if ($internalHooks.indexOf(key) > -1) {
      options[key] = proto[key]
      return
    }
```

- 2.2 处理特定属性

- 2.2.1 

获取每个属性的描述符

```js
    const descriptor = Object.getOwnPropertyDescriptor(proto, key)!
```

如果当前属性的描述`value`不是`undefined`, 说明这个属性有值

这里分别加入到`methods`中和`mixins`中，

```typescript
if (descriptor.value !== void 0) {
    // methods
    if (typeof descriptor.value === 'function') {
    (options.methods || (options.methods = {}))[key] = descriptor.value
    } else {
    // typescript decorated data
    (options.mixins || (options.mixins = [])).push({
        data (this: Vue) {
        return { [key]: descriptor.value }
        }
    })
    }
} 
```


如果是undefined， 这里会标记成computed的属性

```typescript
if (descriptor.get || descriptor.set) {
    // computed properties
    (options.computed || (options.computed = {}))[key] = {
    get: descriptor.get,
    set: descriptor.set
    }
}
```


最后  收集所有类的属性，处理成vue实例的属性

```typescript
// add data hook to collect class properties as Vue instance's data
;(options.mixins || (options.mixins = [])).push({
data (this: Vue) {
    return collectDataFromConstructor(this, Component)
}
  })
```


执行所有装饰器函数

```typescript
  // decorate options
  const decorators = (Component as DecoratedClass).__decorators__
  if (decorators) {
    decorators.forEach(fn => fn(options))
    delete (Component as DecoratedClass).__decorators__
  }
```

找到根的实例对象，这里可能是Vue对象，也可能是Vue的实例对象
通过`forwardStaticMembers`去继承属性

```typescript
const superProto = Object.getPrototypeOf(Component.prototype)
const Super = superProto instanceof Vue
? superProto.constructor as VueClass<Vue>
: Vue
const Extended = Super.extend(options)
forwardStaticMembers(Extended, Component, Super)
```


### forwardStaticMembers


```typescript

function forwardStaticMembers (
  Extended: typeof Vue,
  Original: typeof Vue,
  Super: typeof Vue
): void {
  // We have to use getOwnPropertyNames since Babel registers methods as non-enumerable
  Object.getOwnPropertyNames(Original).forEach(key => {
    // Skip the properties that should not be overwritten
    // 剔除应该忽略的
    if (shouldIgnore[key]) {
      return
    }

    // Some browsers does not allow reconfigure built-in properties
    // 剔除configurable为false的
    const extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key)
    if (extendedDescriptor && !extendedDescriptor.configurable) {
      return
    }

    const descriptor = Object.getOwnPropertyDescriptor(Original, key)!

    // If the user agent does not support `__proto__` or its family (IE <= 10),
    // the sub class properties may be inherited properties from the super class in TypeScript.
    // We need to exclude such properties to prevent to overwrite
    // the component options object which stored on the extended constructor (See #192).
    // If the value is a referenced value (object or function),
    // we can check equality of them and exclude it if they have the same reference.
    // If it is a primitive value, it will be forwarded for safety.
    // 如果不存在__proto__的情况
    if (!hasProto) {
      // Only `cid` is explicitly exluded from property forwarding
      // because we cannot detect whether it is a inherited property or not
      // on the no `__proto__` environment even though the property is reserved.
      if (key === 'cid') {
        return
      }

      const superDescriptor = Object.getOwnPropertyDescriptor(Super, key)
      // 如果值相等的情况也剔除出去
      if (
        !isPrimitive(descriptor.value) &&
        superDescriptor &&
        superDescriptor.value === descriptor.value
      ) {
        return
      }
    }
    // 往需要继承的对象上写入值
    Object.defineProperty(Extended, key, descriptor)
  })
}

```

### collectDataFromConstructor

```typescript

export function collectDataFromConstructor (vm: Vue, Component: VueClass<Vue>) {
  // override _init to prevent to init as Vue instance
  // 储存原来的_init方法
  const originalInit = Component.prototype._init
  // 重写_init方法
  Component.prototype._init = function (this: Vue) {
    // proxy to actual vm
    // 获取对象实例上的属性
    const keys = Object.getOwnPropertyNames(vm)
    // 2.2.0 compat (props are no longer exposed as self properties)
    if (vm.$options.props) {
      for (const key in vm.$options.props) {
        if (!vm.hasOwnProperty(key)) {
          // 搜集props中的key，同时也加入到keys中
          keys.push(key)
        }
      }
    }
    // 定义对应key的取值和赋值方式
    keys.forEach(key => {
      Object.defineProperty(this, key, {
        get: () => vm[key],
        set: value => { vm[key] = value },
        configurable: true
      })
    })
  }

  // should be acquired class property values
  // 组件实例化
  const data = new Component()

  // restore original _init to avoid memory leak (#209)
  // 恢复原来的_init方法
  Component.prototype._init = originalInit

  // create plain data object
  // 实例化后的对象
  const plainData = {}
  Object.keys(data).forEach(key => {
    // 并且该值一定是非undefined
    if (data[key] !== undefined) {
      plainData[key] = data[key]
    }
  })

  return plainData
}
```
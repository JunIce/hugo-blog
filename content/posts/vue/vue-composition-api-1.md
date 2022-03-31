---
title: "Vue -- Composition Api(1)"
date: 2021-03-21T20:46:33+08:00
draft: true
tags: ["vue2", "@vue/composition-api"]
categories: ["vue"]
---

## @vue/composition-api 解读1

vue-composition-api 是 vue 官方出得, 基于vue3的RFC来兼容Vue2.x的增强api，具体API和vue-next 是差不多的， 具体的API详见 [vue-composition-api-rfc](https://vue-composition-api-rfc.netlify.app/zh/api.html#setup), 本系列文章是基于你对vue2有所了解的情况

### proxy

vue2的响应式是基于`Object.defineProperty` 的 `set` 和 `get`方法来实现的,具体的在源码中的实现, 这也是组合式API响应式的基础

```js
// src/utils/utils.ts
export function proxy(
  target: any,
  key: string,
  { get, set }: { get?: Function; set?: Function }
) {
  sharedPropertyDefinition.get = get || noopFn
  sharedPropertyDefinition.set = set || noopFn
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```
其中`sharedPropertyDefinition`存在`get`和`set`方法


### reactive

`reactive`是组合式API提供的一个实现对象响应式的API, 使用方法也很简单，就是传入一个object

```js
setup() {
    const state = reactive({
        foo: 'foo'
    })

    return {
        state
    }
}
```

源码中的实现我们一一来看

```js
export function reactive<T extends object>(obj: T): UnwrapRef<T> {
  if (__DEV__ && !obj) {
    warn('"reactive()" is called without provide an "object".')
    // @ts-ignore
    return
  }

  if (
    !isPlainObject(obj) || // 非原始对象
    isReactive(obj) || // 已是响应式
    isRaw(obj) || // 
    !Object.isExtensible(obj) // 对象不可扩展
  ) {
    return obj as any
  }

  const observed = observe(obj)
  // def(obj, ReactiveIdentifierKey, ReactiveIdentifier);
  markReactive(obj)
  setupAccessControl(observed)
  return observed as UnwrapRef<T>
}
```
其中 `observe`是实现响应式的关键， 我们打开看一看

```js

function observe<T>(obj: T): T {
  const Vue = getVueConstructor()
  let observed: T
  if (Vue.observable) {
    observed = Vue.observable(obj)
  } else {
    const vm = defineComponentInstance(Vue, {
      data: {
        $$state: obj,
      },
    })
    observed = vm._data.$$state
  }

  return observed
}
```
你没看错，就这么简单， 实际上就是用vue2现成的api来实现的 `Vue.observable`, `else`下面是用来兼容以前老版本vue没有`observable`的

`markReactive` 标记 `reactive`中的对象, 实现方式其实也是使用`Object.defineProperty`来写入标记值, 
其中标记都是用`Symbol`来标识唯一性的

### ref

`ref` 是组合式API中另一个响应式api，传入一个基本类型参数

使用
```js
setup() {
    const state = ref(1/"hello world"/false/null)

    return {
        state
    }
}
```
取值方式`state.value`， 如果使用模版方式就不需要使用`.value`方式，模版已经做了这个工作，如果使用`jsx`或`render`函数，就只能手加了

具体实现

```js
export function ref(raw?: unknown) {
  if (isRef(raw)) {
    return raw
  }

  const value = reactive({ [RefKey]: raw })
  return createRef({
    get: () => value[RefKey] as any,
    set: (v) => ((value[RefKey] as any) = v),
  })
}
```
其中在内部实现了组装了一个对象，还是用的`reactive`实现逻辑
关键在`createRef`

```js
class RefImpl<T> implements Ref<T> {
  readonly [_refBrand]!: true
  public value!: T
  constructor({ get, set }: RefOption<T>) {
    proxy(this, 'value', {
      get,
      set,
    })
  }
}

export function createRef<T>(options: RefOption<T>) {
  // seal the ref, this could prevent ref from being observed
  // It's safe to seal the ref, since we really shouldn't extend it.
  // related issues: #79
  return Object.seal(new RefImpl<T>(options))
}
```
其中`Object.seal` 封闭了一个`RefImpl`对象，使其对象不能添加其他任何属性，已有属性可以更改,具体的去查`Object.seal`的文档

`RefImpl`中 用我们上面写的响应式方法`proxy`， 传入`get`和`set`来重写他的`get`和`set`方法

官方用`ref`的方式来获得dom实例
```vue
<template>
  <div ref="root"></div>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      onMounted(() => {
        // 在渲染完成后, 这个 div DOM 会被赋值给 root ref 对象
        console.log(root.value) // <div/>
      })

      return {
        root,
      }
    },
  }
</script>
```

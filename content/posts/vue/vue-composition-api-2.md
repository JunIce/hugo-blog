---
title: "Vue Composition Api 2"
date: 2021-03-21T20:47:17+08:00
draft: true
tags: ["vue2", "@vue/composition-api"]
categories: ["vue"]
---

## @vue/composition-api 解读(2)


### computed api

使用方式
```js
computed(() => count.value + 1)

//
computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1
  },
})
```
传入一个函数或者传入一个有`get`和`set`方法的对象

```js
export function computed<T>(
  options: Option<T>['get'] | Option<T>
): ComputedRef<T> | WritableComputedRef<T> {
  const vm = getCurrentInstance()
  let get: Option<T>['get'], set: Option<T>['set'] | undefined
  if (typeof options === 'function') {
    get = options
  } else {
    get = options.get
    set = options.set
  }

  const computedHost = defineComponentInstance(getVueConstructor(), {
    computed: {
      $$state: {
        get,
        set,
      },
    },
  })

  vm && vm.$on('hook:destroyed', () => computedHost.$destroy())

  return createRef<T>({
    get: () => (computedHost as any).$$state,
    set: (v: T) => {
      if (__DEV__ && !set) {
        warn('Computed property was assigned to but it has no setter.', vm!)
        return
      }

      ;(computedHost as any).$$state = v
    },
  })
}
```
实现方式其实还是借用来原vue2的`computed`方式， 销毁方式值得大家学习一下， `vm.$on('hook:destroyed', () => computedHost.$destroy())` 日常大家去监听组件的生命周期函数都不会这样去使用的吧

### createComponent

`createComponent` v1.0 版本已经丢弃了， 其实就是 `Vue.$createElement` 也就是`h`函数

### watch

源码
```js
export function watch<T = any>(
  source: WatchSource<T> | WatchSource<T>[],
  cb: WatchCallback<T>,
  options?: WatchOptions
): WatchStopHandle {
  let callback: WatchCallback<unknown> | null = null
  if (typeof cb === 'function') {
    // source watch
    callback = cb as WatchCallback<unknown>
  } else {
    // effect watch
    if (__DEV__) {
      warn(
        `\`watch(fn, options?)\` signature has been moved to a separate API. ` +
          `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` +
          `supports \`watch(source, cb, options?) signature.`
      )
    }
    options = cb as Partial<WatchOptions>
    callback = null
  }

  const opts = getWatcherOption(options) // watch的配置，deep、immdediate等等
  const vm = getWatcherVM() // 获取vue实例上的$watch api

  return createWatcher(vm, source, callback, opts)
}
```

在`createWatcher`中可以看到 `watch`中可以传递的数据源, 无论传递进去什么参数都转换为一个函数形式
```js
if (Array.isArray(source)) {
    getter = () => source.map((s) => (isRef(s) ? s.value : s()))
  } else if (isRef(source)) {
    getter = () => source.value
  } else if (isReactive(source)) {
    getter = () => source
    deep = true
  } else if (isFunction(source)) {
    getter = source as () => any
  } else {
    getter = noopFn
    warn(
      `Invalid watch source: ${JSON.stringify(source)}.
      A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`,
      vm
    )
  }
```
可以是Array、响应式数据源、有返回值的函数

```js
const applyCb = (n: any, o: any) => {
    // cleanup before running cb again
    runCleanup()
    cb(n, o, registerCleanup)
  }
let callback = createScheduler(applyCb)
```
`createScheduler`创建任务队列
```js
const createScheduler = <T extends Function>(fn: T): T => {
    if (
      isSync ||
      /* without a current active instance, ignore pre|post mode */ vm ===
        fallbackVM
    ) {
      return fn
    }
    return (((...args: any[]) =>
      queueFlushJob(
        vm,
        () => {
          fn(...args)
        },
        flushMode as 'pre' | 'post'
      )) as any) as T
  }
```

```js
function queueFlushJob(
  vm: any,
  fn: () => void,
  mode: Exclude<FlushMode, 'sync'>
) {
  // flush all when beforeUpdate and updated are not fired
  const fallbackFlush = () => {
    vm.$nextTick(() => {
      if (vm[WatcherPreFlushQueueKey].length) {
        flushQueue(vm, WatcherPreFlushQueueKey)
      }
      if (vm[WatcherPostFlushQueueKey].length) {
        flushQueue(vm, WatcherPostFlushQueueKey)
      }
    })
  }

  switch (mode) {
    case 'pre':
      fallbackFlush()
      vm[WatcherPreFlushQueueKey].push(fn)
      break
    case 'post':
      fallbackFlush()
      vm[WatcherPostFlushQueueKey].push(fn)
      break
    default:
      assert(
        false,
        `flush must be one of ["post", "pre", "sync"], but got ${mode}`
      )
      break
  }
}
```
在`Vue.$nextTick`中执行数组中的依赖函数，即在渲染完成后才进行回调，`mode=sync`除外


### createApp

`createApp` 是组合式API新增加的实例化应用根结点的入口

```js
export function createApp(rootComponent: any, rootProps: any = undefined): App {
  const V = getVueConstructor()!

  let mountedVM: Vue | undefined = undefined

  return {
    config: V.config,
    use: V.use.bind(V),
    mixin: V.mixin.bind(V),
    component: V.component.bind(V),
    directive: V.directive.bind(V),
    mount: (el, hydrating) => {
      if (!mountedVM) {
        mountedVM = new V({ propsData: rootProps, ...rootComponent })
        mountedVM.$mount(el, hydrating)
        return mountedVM
      } else {
        if (__DEV__) {
          warn(
            `App has already been mounted.\n` +
              `If you want to remount the same app, move your app creation logic ` +
              `into a factory function and create fresh app instances for each ` +
              `mount - e.g. \`const createMyApp = () => createApp(App)\``
          )
        }
        return mountedVM
      }
    },
    unmount: () => {
      if (mountedVM) {
        mountedVM.$destroy()
        mountedVM = undefined
      } else if (__DEV__) {
        warn(`Cannot unmount an app that is not mounted.`)
      }
    },
  }
}
```


具体使用
`createApp(App).mount('#app')`
由源码可知所有的需要添加的插件必须在实例化之前完成, 第二个参数可以传递一些初始的参数，这个API其实是用补充来完成vue3中的api， vue3中也有这个api


### 生命周期
vue2组合式api中对于setup中新增加了生命周期函数，用来兼容原来vue2中生命周期

想比于原来的生命周期的声明方式，新声明周期api更加灵活，可以多次声明，组合式API回自动进行合并，也减少了部分声明周期API，学习负担更小了，组织代码的结构更加灵活了

以下是源码
```js
const genName = (name: string) => `on${name[0].toUpperCase() + name.slice(1)}`
function createLifeCycle(lifeCyclehook: string) {
  return (callback: Function) => {
    const vm = currentVMInFn(genName(lifeCyclehook))
    if (vm) {
      injectHookOption(getVueConstructor(), vm, lifeCyclehook, callback)
    }
  }
}

function injectHookOption(
  Vue: VueConstructor,
  vm: ComponentInstance,
  hook: string,
  val: Function
) {
  const options = vm.$options as any
  const mergeFn = Vue.config.optionMergeStrategies[hook]
  options[hook] = mergeFn(options[hook], wrapHookCall(vm, val))
}

function wrapHookCall(vm: ComponentInstance, fn: Function) {
  return (...args: any) => {
    let preVm = getCurrentInstance()
    setCurrentInstance(vm)
    try {
      return fn(...args)
    } finally {
      setCurrentInstance(preVm)
    }
  }
}
```
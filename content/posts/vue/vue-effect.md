---
title: "Vue Effect 源码解读"
date: 2022-03-24T09:21:16+08:00
draft: true
tags: ["vue3"]
categories: ["vue"]
---





# effect



`@vue/reactivity` version `3.2.31`



## 用法



```typescript
let dummy
const obj = reactive({ prop: 'value' })
effect(() => (dummy = obj.prop))

expect(dummy).toBe('value')
// @ts-ignore
delete obj.prop
expect(dummy).toBe(undefined)
```



## 源码



源码入口

### effect

```typescript
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner {
  // 是一个ReactiveEffect对象，拿出fn
  if ((fn as ReactiveEffectRunner).effect) {
    fn = (fn as ReactiveEffectRunner).effect.fn
  }

  const _effect = new ReactiveEffect(fn)
  if (options) {
    extend(_effect, options)
    if (options.scope) recordEffectScope(_effect, options.scope)
  }
  if (!options || !options.lazy) {
    _effect.run()
  }
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}
```



effect 一共2个参数

- 第一个参数是一个函数， 当函数中有引用到响应式数据发生变化时，effect函数会立即执行
- 一些配置参数 `ReactiveEffectOptions`

```typescript
export interface ReactiveEffectOptions extends DebuggerOptions {
  lazy?: boolean
  scheduler?: EffectScheduler
  scope?: EffectScope
  allowRecurse?: boolean
  onStop?: () => void
}
```

`ReactiveEffect` 最终生成一个`effect`实例

后续是要立即执行，还是抛给外面去手动调用，由配置`options`决定



### ReactiveEffect

```typescript
export class ReactiveEffect<T = any> {
  active = true
  deps: Dep[] = []
  parent: ReactiveEffect | undefined = undefined

  /**
   * Can be attached after creation
   * @internal
   */
  computed?: ComputedRefImpl<T>
  /**
   * @internal
   */
  allowRecurse?: boolean

  onStop?: () => void
  // dev only
  onTrack?: (event: DebuggerEvent) => void
  // dev only
  onTrigger?: (event: DebuggerEvent) => void

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
    scope?: EffectScope
  ) {
    recordEffectScope(this, scope)
  }

  run() {
    if (!this.active) {
      return this.fn()
    }
    let parent: ReactiveEffect | undefined = activeEffect
    let lastShouldTrack = shouldTrack
    while (parent) {
      if (parent === this) {
        return
      }
      parent = parent.parent
    }
    try {
      this.parent = activeEffect
      activeEffect = this
      shouldTrack = true

      trackOpBit = 1 << ++effectTrackDepth

      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this)
      } else {
        cleanupEffect(this)
      }
      return this.fn()
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this)
      }

      trackOpBit = 1 << --effectTrackDepth

      activeEffect = this.parent
      shouldTrack = lastShouldTrack
      this.parent = undefined
    }
  }

  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}
```



`effect` 中最重要的就是`run`方法



### run()

```
let parent: ReactiveEffect | undefined = activeEffect
while (parent) {
  if (parent === this) {
    return
  }
  parent = parent.parent
}
```

可以看到就是如果有effect中的`parent`等于自身时，会退出

应该是防止递归依赖的问题



### try-finally

下面走到`try`里面

```typescript
try {
  this.parent = activeEffect
  activeEffect = this
  shouldTrack = true

  trackOpBit = 1 << ++effectTrackDepth

  if (effectTrackDepth <= maxMarkerBits) {
    initDepMarkers(this)
  } else {
    cleanupEffect(this)
  }
  return this.fn()
} finally {
  if (effectTrackDepth <= maxMarkerBits) {
    finalizeDepMarkers(this)
  }

  trackOpBit = 1 << --effectTrackDepth

  activeEffect = this.parent
  shouldTrack = lastShouldTrack
  this.parent = undefined
}
```

#### **try**下面做了以下操作

- 之前的`activeEffect`赋值到`this.parent`上
- 把当前的`this`赋值到`activeEffect`上
- `shouldTrack`这里置为`true`， 其实上面也有一个变量`lastShouldTrack`, 防止丢失之前的`shouldTrack`的状态

- `trackOpBit`用了一个位运算， 1相对 `effectTrackDepth`右移的值

- `maxMarkerBits`是一个依赖循环的最大值，最大30层

```typescript
if (effectTrackDepth <= maxMarkerBits) {
    initDepMarkers(this)
} else {
    cleanupEffect(this)
}
```

- 最终执行`effect`中的回调函数
- 回调函数执行完后会进入到 `finally`下



#### **finally**

- `finalizeDepMarkers`这个方法， 把当前`effect`上的所有`deps`上的**w**和**s**清空

- `effectTrackDepth`  减1
- `activeEffect`重新赋值`this.parent`
- `shouldTrack`重置
- `this.parent`置null



### activeEffect



这是`effect`中最重要的一环了， 在`effect`中会定义`activeEffect`的值



我们回到 `ref.ts`中有个`trackRefValue`,  里面有个`trackEffects`函数

同样`reactive`中`createGetter`方法,  里面也会走到这个函数

#### trackEffects

```typescript
export function trackEffects(
  dep: Dep,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  let shouldTrack = false
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit // set newly tracked
      shouldTrack = !wasTracked(dep)
    }
  } else {
    // Full cleanup mode.
    shouldTrack = !dep.has(activeEffect!)
  }

  if (shouldTrack) {
    dep.add(activeEffect!)
    activeEffect!.deps.push(dep)
  }
}
```



这里就能看到， `get`函数最终会保存在`dep`中， `dep`会塞入当前激活的`effect`， 也就是`activeEffect`

同样， `activeEffect`中也会放入当前的变量的依赖`dep`

这里这样设置，不管是谁，都能在`deps`中找到对方



#### triggerEffects

触发effect

```typescript
export function triggerEffects(
  dep: Dep | ReactiveEffect[],
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  // spread into array for stabilization
  for (const effect of isArray(dep) ? dep : [...dep]) {
    if (effect !== activeEffect || effect.allowRecurse) {
      if (effect.scheduler) {
        effect.scheduler()
      } else {
        effect.run()
      }
    }
  }
}          
```



`ref`或者`reactive`在触发`set`方法时，会触发到依赖它的`effect`



也由此能预测到

`effect`中存在多个依赖的响应式变量时，不管谁发生变化，都会触发当前的`effect`函数执行










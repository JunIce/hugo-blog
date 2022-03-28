---
title: "Vue Computed"
date: 2022-03-27T14:38:16+08:00
draft: true
tags: ["vue3"]
categories: ["vue"]
---



# computed



`computed`这个`api`一直是`vue`中的特色功能了， 其主要功能就是能根据现有的变量进行响应式变化，可以组装出模板需要的数据格式，更关键的是，`computed`可以**缓存**，依赖的响应式数据不变化，`computed`就可以**不用重复计算**。





## 用法



```typescript
const value = reactive<{ foo?: number }>({})
const cValue = computed(() => value.foo)
expect(cValue.value).toBe(undefined)
value.foo = 1
expect(cValue.value).toBe(1)
```



## 源码





### 主入口

```typescript
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions,
  isSSR = false
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  const onlyGetter = isFunction(getterOrOptions)
  if (onlyGetter) {
    getter = getterOrOptions
    setter = NOOP
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR)

  return cRef as any
}
```

主入口的代码很简单，其实就是判断`computed`传入的参数是函数还是一个包含`get`和`set`函数的对象， 函数中做了一些容错



### ComputedRefImpl



```typescript
export class ComputedRefImpl<T> {
  public dep?: Dep = undefined

  private _value!: T
  public readonly effect: ReactiveEffect<T>

  public readonly __v_isRef = true
  public readonly [ReactiveFlags.IS_READONLY]: boolean

  public _dirty = true
  public _cacheable: boolean

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean,
    isSSR: boolean
  ) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this)
      }
    })
    this.effect.computed = this
    this.effect.active = this._cacheable = !isSSR
    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  get value() {
    // the computed ref may get wrapped by other proxies e.g. readonly() #3376
    const self = toRaw(this)
    trackRefValue(self)
    if (self._dirty || !self._cacheable) {
      self._dirty = false
      self._value = self.effect.run()!
    }
    return self._value
  }

  set value(newValue: T) {
    this._setter(newValue)
  }
}
```



#### constructor

这个`ComputedRefImpl`内部还是用 `ReactiveEffect`实现的一个`effect`实例



- 内部变量`_dirty`, 用来判断是否需要重新执行依赖`run`方法， 也就是我们所看到的是否有缓存



`ReactiveEffect`实例化时传入的第一个参数，也就是`computed`主函数

这里`ReactiveEffect`实例化时传入了第二个参数，也就是`scheduler`函数

- 这里依赖的响应式数据发生变化时，就不会执行`run`方法了，会执行这个`scheduler`函数
- 而`_dirty`在依赖的变量发生变化时，会执行`effect`的`scheduler`方法， 这个方法中会重置`_dirty`变量的值
- 去触发依赖这个计算结果的`effects`



#### get value



```typescript
const self = toRaw(this)
trackRefValue(self)
if (self._dirty || !self._cacheable) {
  self._dirty = false
  self._value = self.effect.run()!
}
return self._value
```



- 拿到初始值(这里原代码备注的是，可能computed ref被其他proxy所包裹）
- 搜集依赖这个`computed`值的`effects`
- 检查`_dirty`属性，如果是`true`就重新计算，并赋值`_value`
- 返回内部变量`_value`





#### set value



即`computed`传入的`set`方法












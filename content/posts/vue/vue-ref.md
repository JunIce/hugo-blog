---
title: "Vue Ref源码解读"
date: 2022-03-24T08:35:59+08:00
draft: true
---





# Vue -- ref源码解读



`ref`是`vue3`中新增的`api`，可以对基础类型的值包装成响应式, 其中最大的特点就是需要通过`.value`去获取ref的值



```typescript
const count = ref<number>(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```



## 源码



入口是`createRef`

### createRef

```typescript
function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}
```



`isRef`判断是否被`ref`包装过，如果已经是`ref`对象，直接返回，算是个优化点吧



### RefImpl



```typescript
class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = this.__v_isShallow ? newVal : toReactive(newVal)
      triggerRefValue(this, newVal)
    }
  }
}
```

一个`class`类, 通过返回一个`RefImpl`实例达到包装成对象的目的

- `_rawValue`: 原始值
- `_value`: 即设置和读取的值
- `set: `  `es6 class set`方法
- `get`:    `es6 class get`方法



其中 `get` 是会直接返回`_value`的值， `set` 会和原来的值做一下比对，如果发生变化才会进行重新写入



`trackRefValue` 和 `triggerRefValue`  分别是搜集依赖和触发依赖，这个在解读 `effect`的时候再说



`ref`的源码就是这么简单






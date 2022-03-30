---
title: "Vue h渲染函数源码"
date: 2022-03-29T14:34:31+08:00
draft: true
tags: ["vue3"]
categories: ["vue"]
---





# h函数

`vue`中用来创建`vnode`的主函数，会生成一个`vnode`对象

`@vue/reactivity` version `3.2.31`



## 用法



```typescript
import { h } from 'vue'


h('div', { id: 'foo' })
h('div', ['foo'])
h(Component, slot)
h('div', {}, vnode)
h('div', null, h('span'), h('span')
```



## 源码



通过动态判断参数的个数，组装不同的参数格式。

```typescript
export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const l = arguments.length
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // 参数个数是两个，并且第二个参数类型是vnode
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      // props without children
      // 没有子元素的vnode
      return createVNode(type, propsOrChildren)
    } else {
      // omit props
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    if (l > 3) {
      // 大于3个时，默认从第3个开始，都是vnode类型的子元素
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l === 3 && isVNode(children)) {
      // 只有3个时，组装成数组
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}
```






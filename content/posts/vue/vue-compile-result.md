---
title: "vue -- compile结果代码解读"
date: 2023-05-09T15:26:32+08:00
tags: ["vue3", "sfc"]
categories: ["vue"]
draft: false
---



# vue -- compile结果代码解读



`vue`中对于`sfc`文件最终的编译结果，可以在`playground`中看到



**源码**

```vue
<script setup>
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <div>hello world</div>
  <input v-model="msg">
</template>
```

**结果**

```js
/* Analyzed bindings: {
  "ref": "setup-const",
  "msg": "setup-ref"
} */
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, vModelText as _vModelText, withDirectives as _withDirectives, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = /*#__PURE__*/_createElementVNode("div", null, "hello world", -1 /* HOISTED */)

import { ref } from 'vue'


const __sfc__ = {
  __name: 'App',
  setup(__props) {

const msg = ref('Hello World!')

return (_ctx, _cache) => {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    _createElementVNode("h1", null, _toDisplayString(msg.value), 1 /* TEXT */),
    _hoisted_1,
    _withDirectives(_createElementVNode("input", {
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((msg).value = $event))
    }, null, 512 /* NEED_PATCH */), [
      [_vModelText, msg.value]
    ])
  ], 64 /* STABLE_FRAGMENT */))
}
}

}
__sfc__.__file = "App.vue"
export default __sfc__
```



## openBlock开启块

`openBlock`很简单，就是在`blockStack`中推入`currentBlock`

```ts
export function openBlock(disableTracking = false) {
  blockStack.push((currentBlock = disableTracking ? null : []))
}
```

默认`disableTracking`是`false`，这里把`currentBlock`重置为空数组



## createElementBlock

在调用完创建块之后，调用`createElementBlock`，这里创建一个元素块

内部调用了`setupBlock`，并且传入了`createBaseVNode`的结果

```ts
export function createElementBlock(
  type: string | typeof Fragment,
  props?: Record<string, any> | null,
  children?: any,
  patchFlag?: number,
  dynamicProps?: string[],
  shapeFlag?: number
) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true /* isBlock */
    )
  )
}
```



### setupBlock

这个函数中把当前vnode的动态节点设置成当前块currentBlock了，方便后续引用操作

内部调用了关闭块，也就是block栈销毁当前的currentBlock，并重新赋值

```ts
function setupBlock(vnode: VNode) {
  // save current block children on the block vnode
  vnode.dynamicChildren =
    isBlockTreeEnabled > 0 ? currentBlock || (EMPTY_ARR as any) : null
  // close block
  closeBlock()
  // a block is always going to be patched, so track it as a child of its
  // parent block
  // 这个时候的currentBlock已经是它前一个了，也就是父节点的
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode)
  }
  return vnode
}

```



### closeBlock关闭块

这里调用`blockStack`的`pop`方法，推出最后一个

并且把`currentBlock`设置为倒数第一个

```ts
export function closeBlock() {
  blockStack.pop()
  currentBlock = blockStack[blockStack.length - 1] || null
}
```



## createElementVNode

创建基础的`VNode`节点

可以看到其实就是`createBaseVNode`



> export { createBaseVNode as createElementVNode }



createElementVNode做了下面几个事情

- 初始化vnode的对象
- 如果有子节点，初始化子节点
  - 如果子节点是字符串，这里的shapeFlag会进行标记，后续在diff的时候就比较快（优化点）



```ts
function createBaseVNode(
  type: VNodeTypes | ClassComponent | typeof NULL_DYNAMIC_COMPONENT,
  props: (Data & VNodeProps) | null = null,
  children: unknown = null,
  patchFlag = 0,
  dynamicProps: string[] | null = null,
  shapeFlag = type === Fragment ? 0 : ShapeFlags.ELEMENT,
  isBlockNode = false,
  needFullChildrenNormalization = false
) {
  const vnode = {
    // ....vnode的初始对象
    // 。。。
  } as VNode

  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children)
    // normalize suspense children
    if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
      ;(type as typeof SuspenseImpl).normalize(vnode)
    }
  } else if (children) {
    // compiled element vnode - if children is passed, only possible types are
    // string or Array.
    vnode.shapeFlag |= isString(children)
      ? ShapeFlags.TEXT_CHILDREN
      : ShapeFlags.ARRAY_CHILDREN
  }

  // track vnode for block tree
  if (
    isBlockTreeEnabled > 0 &&
    // avoid a block node from tracking itself
    !isBlockNode &&
    // has current parent block
    currentBlock &&
    // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & ShapeFlags.COMPONENT) &&
    // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== PatchFlags.HYDRATE_EVENTS
  ) {
    currentBlock.push(vnode)
  }

  // 兼容vue2代码
  if (__COMPAT__) {
    convertLegacyVModelProps(vnode)
    defineLegacyVNodeProperties(vnode)
  }

  return vnode
}
```





## createVNode



内部走的是`_createVNode`方法

```ts
export const createVNode = (
  __DEV__ ? createVNodeWithArgsTransform : _createVNode
) as typeof _createVNode
```



## _createVNode



#### 如果`type`不对, `type`重置为`Comment`类型

```ts
if (!type || type === NULL_DYNAMIC_COMPONENT) {
    if (__DEV__ && !type) {
      warn(`Invalid vnode type when creating vnode: ${type}.`)
    }
    type = Comment
}
```



#### 如果type是vnode

- 克隆vnode，这里克隆时进行了优化，对于原来的ref进行了合并
- 有子节点的进行子节点初始化
- currentBlock依赖搜集
- patchFlag进行标记

```ts
if (isVNode(type)) {
    // createVNode receiving an existing vnode. This happens in cases like
    // <component :is="vnode"/>
    // #2078 make sure to merge refs during the clone instead of overwriting it
    // 克隆vnode， 内部ref进行合并
    const cloned = cloneVNode(type, props, true /* mergeRef: true */)
    // 子节点初始化
    if (children) {
      normalizeChildren(cloned, children)
    }
  	// 
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & ShapeFlags.COMPONENT) {
        currentBlock[currentBlock.indexOf(type)] = cloned
      } else {
        currentBlock.push(cloned)
      }
    }
    // 这里把patchFlag进行标记，后续跳过diff优化
    cloned.patchFlag |= PatchFlags.BAIL
    return cloned
}
```



#### 如果type是class组件

type重新赋值

```ts
// class component normalization.
if (isClassComponent(type)) {
  type = type.__vccOpts
}
```



#### 存在属性

存在`class`或者`style`属性时

进行初始化计算， 这里把`class`进行了拼接、`style`进行了拼接

```ts
// class & style normalization.
  if (props) {
    // for reactive or proxy objects, we need to clone it to enable mutation.
    props = guardReactiveProps(props)!
    let { class: klass, style } = props
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass)
    }
    if (isObject(style)) {
      // reactive state objects need to be cloned since they are likely to be
      // mutated
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style)
      }
      props.style = normalizeStyle(style)
    }
}
```



#### 最后shapeFlag进行重新赋值为位值

缩减字符长度

```ts
  // encode the vnode type information into a bitmap
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : __FEATURE_SUSPENSE__ && isSuspense(type)
    ? ShapeFlags.SUSPENSE
    : isTeleport(type)
    ? ShapeFlags.TELEPORT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : isFunction(type)
    ? ShapeFlags.FUNCTIONAL_COMPONENT
    : 0
```



走到`createBaseVNode`函数，创建出`vnode`


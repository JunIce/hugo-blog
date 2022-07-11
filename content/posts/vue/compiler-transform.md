---
title: "vue3 -- @vue/compiler-core transform代码逻辑"
date: 2022-07-11T15:15:41+08:00
tags: ["vue3", "@vue/compiler-sfc"]
categories: ["vue"]
draft: false
---



# vue3 -- @vue/compiler-core transform代码逻辑



>  "version": "3.2.37"



在vue的template模板字符串进行parse之后，会生成一个ast树，但是此时的ast属还不能直接使用，parse只是单纯的对字符串进行分割。其中的一些节点还是需要转化。包括插值变量绑定，一些特殊的语法糖等等



```typescript
transform(
    ast,
    extend({}, options, {
      prefixIdentifiers,
      nodeTransforms: [
        ...nodeTransforms,
        ...(options.nodeTransforms || []) // user transforms
      ],
      directiveTransforms: extend(
        {},
        directiveTransforms,
        options.directiveTransforms || {} // user transforms
      )
    })
)
```



`transform`接受2个参数，一个是parse之后的ast树，另一个就是一些预设的`transformer`和`directive`



> packages\compiler-core\src\transform.ts



### transform



转换主入口，`root`就是传入的`ast`对象， `options`是转换的配置参数



```typescript
export function transform(root: RootNode, options: TransformOptions) {
  // 一个转换的上下文对象，其中记录当前上下文的所有信息
  const context = createTransformContext(root, options)
  // 从根节点开始转换，根节点中会进行递归转换
  traverseNode(root, context)
  if (options.hoistStatic) {
    hoistStatic(root, context)
  }
  if (!options.ssr) {
    createRootCodegen(root, context)
  }
  // finalize meta information
  root.helpers = [...context.helpers.keys()]
  root.components = [...context.components]
  root.directives = [...context.directives]
  root.imports = context.imports
  root.hoists = context.hoists
  root.temps = context.temps
  root.cached = context.cached

  if (__COMPAT__) {
    root.filters = [...context.filters!]
  }
}
```



### traverseNode

转换主逻辑函数，其中转换的插件会在每次执行的时候执行

根据不同的元素类型，执行不同的转换函数



```typescript
export function traverseNode(
  node: RootNode | TemplateChildNode,
  context: TransformContext
) {
  // 使用currentNode记录当前操作的node
  context.currentNode = node
  // apply transform plugins
  // 拿到transform插件数组
  const { nodeTransforms } = context
  const exitFns = []
  for (let i = 0; i < nodeTransforms.length; i++) {
    // 每个单独执行
    const onExit = nodeTransforms[i](node, context)
    if (onExit) {
      // 如果返回结束函数的，进行搜集
      if (isArray(onExit)) {
        exitFns.push(...onExit)
      } else {
        exitFns.push(onExit)
      }
    }
    // 容错，如果没有当前节点了，进行覆盖，保持原节点
    if (!context.currentNode) {
      // node was removed
      return
    } else {
      // node may have been replaced
      node = context.currentNode
    }
  }

  switch (node.type) {
    case NodeTypes.COMMENT:
      if (!context.ssr) {
        // inject import for the Comment symbol, which is needed for creating
        // comment nodes with `createVNode`
        // 使用createCommentVNode创建静态节点
        context.helper(CREATE_COMMENT)
      }
      break
    case NodeTypes.INTERPOLATION:
      // no need to traverse, but we need to inject toString helper
      if (!context.ssr) {
        // 插值表达式，不需要转换，但是需要转换成参数
        context.helper(TO_DISPLAY_STRING)
      }
      break

    // for container types, further traverse downwards
    case NodeTypes.IF:
      // if 节点，每个分支进行转换
      for (let i = 0; i < node.branches.length; i++) {
        traverseNode(node.branches[i], context)
      }
      break
    case NodeTypes.IF_BRANCH:
    case NodeTypes.FOR:
    case NodeTypes.ELEMENT:
    case NodeTypes.ROOT:
      // 节点子元素进行递归转换
      traverseChildren(node, context)
      break
  }

  // exit transforms
  // https://github.com/vuejs/core/issues/2035
  // 修复v-once 和条件分支并存的情况
  context.currentNode = node

  // 循环执行退出函数
  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}
```



### traverseChildren



子元素递归调用`traverseNode`



```typescript
export function traverseChildren(
  parent: ParentNode,
  context: TransformContext
) {
  let i = 0
  const nodeRemoved = () => {
    i--
  }
  // 递归调用children , 实际走的还是traverseNode
  for (; i < parent.children.length; i++) {
    const child = parent.children[i]
    if (isString(child)) continue
    context.parent = parent
    context.childIndex = i
    context.onNodeRemoved = nodeRemoved
    traverseNode(child, context)
  }
}
```


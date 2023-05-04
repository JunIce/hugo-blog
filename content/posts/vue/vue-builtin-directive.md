---
title: "Vue -- 内置指令源码"
date: 2023-05-03T08:49:34+08:00
tags: ["vue3", "v-if", "v-once"]
categories: ["vue"]
draft: false
---




# Vue -- 内置指令源码





## v-once

`v-once`在`vue`中用于缓存`dom`实现，在加了这个指令的节点上，只会渲染一次，后续`dom`更新时会直接使用缓存



### transformOnce



这里用一个`WeakSet`储存缓存节点，并且设置转换上下文的`inVOnce`属性为`true`

返回一个闭包函数， 函数内设置`inVOnce`为false



```ts
const seen = new WeakSet()

export const transformOnce: NodeTransform = (node, context) => {
  if (node.type === NodeTypes.ELEMENT && findDir(node, 'once', true)) {
    if (seen.has(node) || context.inVOnce || context.inSSR) {
      return
    }
    seen.add(node)
    context.inVOnce = true
    context.helper(SET_BLOCK_TRACKING)
    return () => {
      context.inVOnce = false
      const cur = context.currentNode as ElementNode | IfNode | ForNode
      if (cur.codegenNode) {
        cur.codegenNode = context.cache(cur.codegenNode, true /* isVNode */)
      }
    }
  }
}
```



## v-if



### transformIf

转化节点中`if`、`else`、`else-if`指令

```ts
export const transformIf = createStructuralDirectiveTransform(
  /^(if|else|else-if)$/,
  (node, dir, context) => {
    return processIf(node, dir, context, (ifNode, branch, isRoot) => {
    	// main code
    }
  }
)
```



### createStructuralDirectiveTransform



这里实现了一个高阶函数

传入的可以是一个字符串，也可以是正则表达式， 目的是实现一个匹配函数

返回一个闭包，闭包中遍历`node`节点属性，遍历节点的`props`，找到目标节点并执行回调函数

```ts
export function createStructuralDirectiveTransform(
  name: string | RegExp,
  fn: StructuralDirectiveTransform
): NodeTransform {
  const matches = isString(name)
    ? (n: string) => n === name
    : (n: string) => name.test(n)

  return (node, context) => {
    if (node.type === NodeTypes.ELEMENT) {
      const { props } = node
      // structural directive transforms are not concerned with slots
      // as they are handled separately in vSlot.ts
      if (node.tagType === ElementTypes.TEMPLATE && props.some(isVSlot)) {
        return
      }
      const exitFns = []
      for (let i = 0; i < props.length; i++) {
        const prop = props[i]
        if (prop.type === NodeTypes.DIRECTIVE && matches(prop.name)) {
          // structural directives are removed to avoid infinite recursion
          // also we remove them *before* applying so that it can further
          // traverse itself in case it moves the node around
          props.splice(i, 1)
          i--
          const onExit = fn(node, prop, context)
          if (onExit) exitFns.push(onExit)
        }
      }
      return exitFns
    }
  }
}

```



### processIf

如果指令属性名是`if`，这里会创建一个`ifNode`，并且替换原节点

#### 1.处理v-if节点

```ts
if (dir.name === 'if') {
    const branch = createIfBranch(node, dir)
    const ifNode: IfNode = {
      type: NodeTypes.IF,
      loc: node.loc,
      branches: [branch]
    }
    context.replaceNode(ifNode)
    if (processCodegen) {
      return processCodegen(ifNode, branch, true)
    }
  }
```



##### createIfBranch

这里创建一个`if`节点，如果是`template`上的`if`指令，还会做其他的记录

```ts
function createIfBranch(node: ElementNode, dir: DirectiveNode): IfBranchNode {
  const isTemplateIf = node.tagType === ElementTypes.TEMPLATE
  return {
    type: NodeTypes.IF_BRANCH,
    loc: node.loc,
    condition: dir.name === 'else' ? undefined : dir.exp,
    children: isTemplateIf && !findDir(node, 'for') ? node.children : [node],
    userKey: findProp(node, `key`),
    isTemplateIf
  }
}
```



#### 处理v-else、v-else-if节点

1. 找出父所有的子节点

2. 根据indexOf方法找到索引

3. 从当前索引向前遍历

   1. 如果是注释节点，删除

      ```ts
      if (sibling && sibling.type === NodeTypes.COMMENT) {
              context.removeNode(sibling)
              __DEV__ && comments.unshift(sibling)
              continue
        }
      ```

   2. 如果是文本节点，并且文本节点含有字符，删除

      ```ts
      if (
              sibling &&
              sibling.type === NodeTypes.TEXT &&
              !sibling.content.trim().length
            ) {
              context.removeNode(sibling)
              continue
            }
      ```

   3. 如果兄弟节点是if节点，这里才开始检查正文

      1. 如果当前节点指令是`else-if`，这里用来判断`v-else-if`必须在`v-else`前面

         ```ts
         if (
           dir.name === 'else-if' &&
           sibling.branches[sibling.branches.length - 1].condition === undefined
         ) {
           context.onError(
             createCompilerError(ErrorCodes.X_V_ELSE_NO_ADJACENT_IF, node.loc)
           )
         }
         ```

      2. 移除当前节点

         ```ts
         context.removeNode()
         ```

      3. 增加到if节点的分支`branchs`中

         ```ts
         sibling.branches.push(branch)
         ```

      4. 处理转化节点和他的子节点

         ```ts
         const onExit = processCodegen && processCodegen(sibling, branch, false)
         // since the branch was removed, it will not be traversed.
         // make sure to traverse here.
         traverseNode(branch, context)
         // call on exit
         if (onExit) onExit()
         // make sure to reset currentNode after traversal to indicate this
         // node has been removed.
         context.currentNode = null
         ```

         


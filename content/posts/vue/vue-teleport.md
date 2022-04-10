---
title: "Vue Teleport解析"
date: 2022-04-09T16:28:50+08:00
draft: true
tags: ["vue3"]
categories: ["vue"]
---



# Teleport



>  "version": "3.2.31"



`teleport`是`vue3`中一个内置的api， 使用效果类似 `react` 中的 `teleport`



作用就是一个传送门， 可以把节点渲染到指定节点下， 原来vue组件中的节点最终都会生成在 根节点下面， 使用这个组件，我们就能方便的把节点渲染到body下了



## 用法





```html

  <!-- to 属性就是目标位置 -->
  <teleport to="#teleport-target" disabled="boolean">
    <div v-if="visible" class="toast-wrap">
      <div class="toast-msg">我是一个 Toast 文案</div>
    </div>
  </teleport>
  
```



- to： 最终可以渲染到的节点选择器或者直接就是传入节点的引用  // document.quertSelector('body')
- disabled: 布尔值。 可以控制传送门是否渲染到目标节点





## 源码



首先认识一个原生api， 这里的



> parentNode.insertBefore(newNode, referenceNode)



### resolveTarget

```typescript

const resolveTarget = <T = RendererElement>(
  props: TeleportProps | null,
  select: RendererOptions['querySelector']
): T | null => {
  const targetSelector = props && props.to
  if (isString(targetSelector)) {
    if (!select) {
      return null
    } else {
      const target = select(targetSelector)
      return target as any
    }
  } else {
    return targetSelector as any
  }
}

```



这个函数也比较简单，其实就是判断teleport传入的是什么参数，是字符串还是dom元素



### TeleportImpl.process



其实就是主处理函数



#### n1 == null, 即首次挂载阶段

```typescript

// insert anchors in the main view
  // 设置锚点
  const placeholder = (n2.el = __DEV__
    ? createComment('teleport start')
    : createText(''))
  const mainAnchor = (n2.anchor = __DEV__
    ? createComment('teleport end')
    : createText(''))
  // 在container位置插入锚点，即开始和结束点
  insert(placeholder, container, anchor)
  insert(mainAnchor, container, anchor)
  // n2的target 赋值
  const target = (n2.target = resolveTarget(n2.props, querySelector))
  const targetAnchor = (n2.targetAnchor = createText(''))
  if (target) {
    // 建立target和targetAnchor之间的联系
    insert(targetAnchor, target)
    // #2652 we could be teleporting from a non-SVG tree into an SVG tree
    isSVG = isSVG || isTargetSVG(target)
  } else if (__DEV__ && !disabled) {
    warn('Invalid Teleport target on mount:', target, `(${typeof target})`)
  }

  const mount = (container: RendererElement, anchor: RendererNode) => {
    // Teleport *always* has Array children. This is enforced in both the
    // compiler and vnode children normalization.
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(
        children as VNodeArrayChildren,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      )
    }
  }

  if (disabled) {
    mount(container, mainAnchor)
  } else if (target) {
    mount(target, targetAnchor)
  }

```



- 第1步，在目标容器和组件内都创建对应的锚点
- 第2步，根据是否被禁用，控制挂载的位置
  - 禁用，即不现实在目标节点内，则挂载在组件内部
  - 启用， 即显示到目标节点内，则挂载在target内



#### update阶段



```typescript
// update content
// 把旧元素上的相关信息都赋值到新元素上
n2.el = n1.el
const mainAnchor = (n2.anchor = n1.anchor)!
const target = (n2.target = n1.target)!
const targetAnchor = (n2.targetAnchor = n1.targetAnchor)!
// 旧元素是否可见
const wasDisabled = isTeleportDisabled(n1.props)
// 旧元素的锚点和容器
const currentContainer = wasDisabled ? container : target
const currentAnchor = wasDisabled ? mainAnchor : targetAnchor

if (!optimized) {
    patchChildren(
      n1,
      n2,
      currentContainer,
      currentAnchor,
      parentComponent,
      parentSuspense,
      isSVG,
      slotScopeIds,
      false
    )
 }
```



- 第1步， 先把旧节点上的相关数据复制到新节点上
- 第2步， 旧节点先走patch，更新内部内容
- 第3步，控制移动逻辑



```typescript
if (disabled) {
    if (!wasDisabled) {
      // enabled -> disabled
      // move into main container
      moveTeleport(
        n2,
        container,
        mainAnchor,
        internals,
        TeleportMoveTypes.TOGGLE
      )
    }
  } else {
    // target changed
    if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
      const nextTarget = (n2.target = resolveTarget(
        n2.props,
        querySelector
      ))
      if (nextTarget) {
        moveTeleport(
          n2,
          nextTarget,
          null,
          internals,
          TeleportMoveTypes.TARGET_CHANGE
        )
      } else if (__DEV__) {
        warn(
          'Invalid Teleport target on update:',
          target,
          `(${typeof target})`
        )
      }
    } else if (wasDisabled) {
      // disabled -> enabled
      // move into teleport target
      moveTeleport(
        n2,
        target,
        targetAnchor,
        internals,
        TeleportMoveTypes.TOGGLE
      )
    }
}
```



- 新元素状态是禁用， 老元素状态是开启状态 即走`enabled -> disabled`，即应该在组件中显示
- 新元素是开启状态
  - 第1种情况： 目标发生变化，走新移动逻辑， anchor是null， 则插入到目标尾部
  - 第2种情况：老元素是禁用，`disabled -> enabled`, 则移动到目标组件内





### moveTeleport

这个函数就是移动teleport的主函数了

```typescript
function moveTeleport(
  vnode: VNode,
  container: RendererElement,
  parentAnchor: RendererNode | null,
  { o: { insert }, m: move }: RendererInternals,
  moveType: TeleportMoveTypes = TeleportMoveTypes.REORDER
) {
  // move target anchor if this is a target change.
  // 移动目标容器
  if (moveType === TeleportMoveTypes.TARGET_CHANGE) {
    insert(vnode.targetAnchor!, container, parentAnchor)
  }
  const { el, anchor, shapeFlag, children, props } = vnode
  const isReorder = moveType === TeleportMoveTypes.REORDER
  // move main view anchor if this is a re-order.
  // 重新排序
  if (isReorder) {
    insert(el!, container, parentAnchor)
  }
  // if this is a re-order and teleport is enabled (content is in target)
  // do not move children. So the opposite is: only move children if this
  // is not a reorder, or the teleport is disabled
  // 既不是更换目标容器， 或者teleport是禁用状态时，子元素一个一个移动
  if (!isReorder || isTeleportDisabled(props)) {
    // Teleport has either Array children or no children.
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      for (let i = 0; i < (children as VNode[]).length; i++) {
        move(
          (children as VNode[])[i],
          container,
          parentAnchor,
          MoveType.REORDER
        )
      }
    }
  }
  // move main view anchor if this is a re-order.
  if (isReorder) {
    insert(anchor!, container, parentAnchor)
  }
}

```



最终这个内部的子元素都是走的`move`， `move`函数还是会走到这个内部

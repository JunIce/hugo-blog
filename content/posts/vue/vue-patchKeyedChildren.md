---
title: "Vue PatchKeyedChildren 源码解读"
date: 2022-03-29T14:34:47+08:00
draft: true
tags: ["vue3"]
categories: ["vue"]
---



# patchKeyedChildren函数



`patchKeyedChildren`就是`vue`中数组元素`diff`的主函数，也是`vue`中实现优化、实现`vnode`复用的主要函数



其中`c1`代表旧数组、`c2`代表新数组

`e1`表示旧数组的最后一个索引，`e2`表示新数组的最后一个索引

`i` 从0开始， 表示c1、c2已经`patch`过的索引



## 1. 从前往后匹配相同的节点



>  (a b) c
>
>  (a b) d e



```typescript
while (i <= e1 && i <= e2) {
  const n1 = c1[i]
  const n2 = (c2[i] = optimized
    ? cloneIfMounted(c2[i] as VNode)
    : normalizeVNode(c2[i]))
  if (isSameVNodeType(n1, n2)) {
    patch(
      n1,
      n2,
      container,
      null,
      parentComponent,
      parentSuspense,
      isSVG,
      slotScopeIds,
      optimized
    )
  } else {
    break
  }
  i++
}
```



相同索引下，同一个类型的元素进行`patch`，其中`i`要进行自增



## 2. 从尾部开始匹配

> a (b c)
>
> d e (b c)



```typescript
while (i <= e1 && i <= e2) {
  const n1 = c1[e1]
  const n2 = (c2[e2] = optimized
    ? cloneIfMounted(c2[e2] as VNode)
    : normalizeVNode(c2[e2]))
  if (isSameVNodeType(n1, n2)) {
    patch(
      n1,
      n2,
      container,
      null,
      parentComponent,
      parentSuspense,
      isSVG,
      slotScopeIds,
      optimized
    )
  } else {
    break
  }
  e1--
  e2--
}
```



和从头部匹配一样的逻辑， 这里要同步调整e1、e2的值，其实就是`c1、c2`尚未匹配的末位索引



## 3. 其他情况

前面`c1、c2`两个数组的收尾能进行patch的已经patch过了，现在`i`已经移动到剩余还没有匹配的位置

到这里我们就要分情况来看了



### 1. c1已经匹配完，但是c2中还有没有匹配的



循环遍历c2,   从i开始到e2的元素进行挂载



```typescript
// (a b)
// (a b) c
// i = 2, e1 = 1, e2 = 2
// (a b)
// c (a b)
// i = 0, e1 = -1, e2 = 0
if (i > e1) {
  if (i <= e2) {
    const nextPos = e2 + 1
    const anchor = nextPos < l2 ? (c2[nextPos] as VNode).el : parentAnchor
    while (i <= e2) {
      patch(
        null,
        (c2[i] = optimized
          ? cloneIfMounted(c2[i] as VNode)
          : normalizeVNode(c2[i])),
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      )
      i++
    }
  }
}
```



### 2. c2已经匹配完，但是c1中还有没有匹配的

说明c1中有元素要进行卸载，即unmount



```typescript
// (a b) c
// (a b)
// i = 2, e1 = 2, e2 = 1
// a (b c)
// (b c)
// i = 0, e1 = 0, e2 = -1
// 新数组比旧数组短， 旧数组中需要删除一些子节点
else if (i > e2) {
  while (i <= e1) {
    unmount(c1[i], parentComponent, parentSuspense, true)
    i++
  }
}
```



### 3. c1、c2中都有剩余的节点，这也是最复杂的一部分了



- 以`c2`剩余节点， 构建一个`map`，映射关系是 `{ key => index }`

```typescript
  const s1 = i // prev starting index
  const s2 = i // next starting index

  // 5.1 build key:index map for newChildren
  const keyToNewIndexMap: Map<string | number | symbol, number> = new Map()
  // 先制作一个新数组中 key对应的map   { key => index }
  // 对应c2中的idx
  for (i = s2; i <= e2; i++) {
    const nextChild = (c2[i] = optimized
      ? cloneIfMounted(c2[i] as VNode)
      : normalizeVNode(c2[i]))
    if (nextChild.key != null) {
      keyToNewIndexMap.set(nextChild.key, i)
    }
  }
```



- 根据待patch的个数构建一个数组，初始化数组的每个元素都是0

```typescript
const toBePatched = e2 - s2 + 1 // 剩余待patch
const newIndexToOldIndexMap = new Array(toBePatched)
for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
```



- 遍历剩余的`c1`数组

1. 从旧数组中拿到key值，再到新map中找有没有对应的key，拿到索引
2. 拿不到对应的索引，就是需要卸载的元素
3. 拿到索引后
   1. 记录到`newIndexToOldIndexMap`对应新数组的位置，这里把索引`+1`， 其实目的就是**为了和0做区分**， 初始化所有值都是0，再记录0，就没有任何意义了
   2. `maxNewIndexSoFar`这个值记录移动的最大索引，为了和当次拿到的索引做比对，看是否有移动的元素。**优化**。
   3. 旧元素做patch

```typescript
// 遍历c1
  for (i = s1; i <= e1; i++) {
    // 旧节点
    const prevChild = c1[i]

    // patch的个数 > 需要被patch的个数， 说明剩下的已经不需要patch了，直接卸载
    if (patched >= toBePatched) {
      // all new children have been patched so this can only be a removal
      unmount(prevChild, parentComponent, parentSuspense, true)
      continue
    }
    // c2中对应的索引
    let newIndex

    // 旧元素带对应的key， 到map中查找
    if (prevChild.key != null) {
      // 新map中能找到对应的节点
      newIndex = keyToNewIndexMap.get(prevChild.key)
    } else {
      // 不能遍历
      // key-less node, try to locate a key-less node of the same type
      // 循环s2， 试图找到可能在s2中可能出现的位置， 对 keyToNewIndexMap的补充
      for (j = s2; j <= e2; j++) {
        if (
          newIndexToOldIndexMap[j - s2] === 0 &&
          isSameVNodeType(prevChild, c2[j] as VNode)
        ) {
          newIndex = j
          break
        }
      }
    }
    // index不存在
    if (newIndex === undefined) {
      // 卸载旧节点
      unmount(prevChild, parentComponent, parentSuspense, true)
    } else {
      // 设置newIndexToOldIndexMap中newIndex对应的元素 = i+1
      newIndexToOldIndexMap[newIndex - s2] = i + 1
      // 如果新指针位置大于
      // 把指针移动到新位置
      if (newIndex >= maxNewIndexSoFar) {
        maxNewIndexSoFar = newIndex
      } else {
        moved = true
      }
      // 走更新
      patch(
        prevChild,
        c2[newIndex] as VNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      )
      patched++
    }
  }
```



- 拿到`newIndexToOldIndexMap`最长子序列对应的下标组成的数组

这里就能看到，为什么之前`newIndexToOldIndexMap`为什么要+1存入，0代表就是要挂载新元素

```typescript
// 最长子序列对应的下标组成的数组
const increasingNewIndexSequence = moved
    ? getSequence(newIndexToOldIndexMap)
    : EMPTY_ARR
  j = increasingNewIndexSequence.length - 1
  // looping backwards so that we can use last patched node as anchor
  // 从后往前走
  for (i = toBePatched - 1; i >= 0; i--) {
    const nextIndex = s2 + i
    const nextChild = c2[nextIndex] as VNode
    const anchor =
      nextIndex + 1 < l2 ? (c2[nextIndex + 1] as VNode).el : parentAnchor
    // 指定位置的值是0，则需要新增mount
    if (newIndexToOldIndexMap[i] === 0) {
      // mount new
      patch(
        null,
        nextChild,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      )
    } else if (moved) { // 移动
      // move if:
      // There is no stable subsequence (e.g. a reverse)
      // OR current node is not among the stable sequence
      if (j < 0 || i !== increasingNewIndexSequence[j]) {
        move(nextChild, container, anchor, MoveType.REORDER)
      } else {
        j--
      }
    }
  }
```










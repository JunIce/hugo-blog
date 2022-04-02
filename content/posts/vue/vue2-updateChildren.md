---
title: "Vue2 diff算法 -- UpdateChildren源码"
date: 2022-03-31T17:22:30+08:00
draft: true
tags: ["vue2"]
categries: ["vue"]
---



# updateChildren



这里研读的是`vue2`版本



>  "version": "2.6.14"



## diff 过程



`oldCh`、`newCh`分别代表旧数组、新数组，以下用`c1`、`c2`表示

`oldCh => c1`

`newCh => c2`



从头开始循环新旧数组

1. 比对c1、c2开头节点，如果一致就进行patch， c1、c2开始节点指针后移一位
2. 比对c1、c2结尾节点，如果一致就进行patch， c1、c2结尾节点指针前移一位
3. 比对c1开头节点、c2结尾节点，如果一致就进行patch， c1开始指针后移一位、c2结尾节点指针前移一位
4. 比对c1结尾节点、c2开头节点，如果一致就进行patch， c1结尾指针前移一位、c2开始节点指针后移一位
5. 以上都匹配不到的情况下
   1. c1剩余节点，创建一个map，key是`c1` `vnode`的key，value是vnode对应的索引
   2. 当前c1的vnode 的 key在map中可以**找不到**对应的旧元素的情况下， 按新元素处理（mounted）
   3. 可以找到的话
      1. 如果类型一致，说明需要移动，即开始移动
      2. 类型不一致，按新元素处理
6. 最后，新旧数组如果还有剩余元素
   1. 如果c1的开始指针已经大于结束指针位置，说明c1已经处理完了，c2还有剩余的， 即c2遍历循环处理剩余
   2. 如果c2的开始指针大于结束指针位置，说明c2已经处理结束，c1还有未卸载的，循环卸载即可









## 源码



```javascript
  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    
    let oldStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    
    let newStartIdx = 0
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }

    // 循环
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        // 不存在旧数组开头，指针后移
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        // 不存在旧数组结尾，指针前移
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 类型相同的开始节点， 开始指针后移
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 类型相同的结尾节点， 开始指针前移
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        // 旧的开头 == 新的结尾， 旧开始指针后移， 新结束指针前移
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        // 旧的结尾 == 新的开头， 旧结尾指针前移， 新开头指针后移
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 创建索引map, 只会创建一次
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)

        // 旧数组中对应的索引
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          // 保底操作
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        
        // 不存在索引的情况， 即需要创建
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
          // 找到对应的vnode
          vnodeToMove = oldCh[idxInOld]
          // 如果移动的vnode和新开始节点类型一致
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // 不一致当新元素对待
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
    // 一顿操作后，还有剩余的节点
    // 旧的开始指针已经大于结束指针了，说明旧的数组操作已经结束了，新的数组还有剩余的，说明要挂载剩余元素
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      // 旧的数组大于新数组的情况
      removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
  }
```


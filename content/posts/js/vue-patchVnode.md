
---
title: "vue2 -- 核心diff 源码解读"
date: 2022-01-11T10:18:05+08:00
draft: true
tags: ["vue", "javascript"]
---


## vue2 组件diff过程
### patchVnode 

打补丁过程

```javascript
function patchVnode(
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
) {
    // 旧node和新node相等，直接退出
    if (oldVnode === vnode) {
        return;
    }
	
    var elm = (vnode.elm = oldVnode.elm);

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    
    // 如果新vnode没有text
    if (isUndef(vnode.text)) {
        // 新老vnode都存在children的情况下
        if (isDef(oldCh) && isDef(ch)) {
            if (oldCh !== ch) { // 并且不相等
                // 走updateChildren 逻辑
                updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
            }
        } else if (isDef(ch)) {
            // 新vnode存在children， 老的没有children
            // 先清除text文本
            if (isDef(oldVnode.text)) {
                nodeOps.setTextContent(elm, "");
            }
            // 在生产新的vnode
            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
            // 老的vnode下是children， 清空数组
            removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
            // 老的vnode下是text， 直接清空
            nodeOps.setTextContent(elm, "");
        }
    } else if (oldVnode.text !== vnode.text) {
        // 如果新vnode有text， 直接调用dom api 更新文本
        nodeOps.setTextContent(elm, vnode.text);
    }
}
```


```javascript
// 更新子元素
function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    {
        // 检查重复key并提示到控制台
        checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) { // 旧数组不存在开始节点，开始指针右移
            oldStartVnode = oldCh[++oldStartIdx];
        } else if (isUndef(oldEndVnode)) {// 旧数组不存在开始节点，结束指针右移
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {// 开始节点相等， 直接patch， 新旧开始指针右移
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {// 结束节点相等， 直接patch， 新旧开始指针左移
            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // 旧的开始 == 新的结束, 先patch再移动位置
            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
            canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) {  // 旧的结束 == 新的开始, 先patch再移动位置
            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            // 遍历出key的map
            if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
            // 旧数组中是否存在新的key对应的旧数组中的索引
            idxInOld = isDef(newStartVnode.key)
                ? oldKeyToIdx[newStartVnode.key]
                : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
            
            if (isUndef(idxInOld)) { // 不存在，创建新的dom元素
                createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            } else {
                vnodeToMove = oldCh[idxInOld];
                // 存在 是否一致
                if (sameVnode(vnodeToMove, newStartVnode)) {
                    // 一致就是先patch，再移动
                    patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                    oldCh[idxInOld] = undefined;
                    canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
                } else {
                    // key一样，但是不是同一个vnode， 创建新的元素
                    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                }
            }
            newStartVnode = newCh[++newStartIdx];
        }
    }

    // 旧的开始结束索引提前相遇，即比对结束
    if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        // 把剩下的从start到end的数据遍历插入到对应的位置
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) { // 数组变短，新的数组开始结束指针提前相遇
        // 遍历删除掉旧数组中不需要得到元素
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
}

```


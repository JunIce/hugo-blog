---
title: "Vue -- 组件vnode diff 源码过程解读"
date: 2022-03-07T14:03:30+08:00
draft: true
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


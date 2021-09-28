---
title: "BaseFindIndex"
date: 2021-09-28T20:25:49+08:00
draft: false
tags: ["JS", "lodash"]
---

## baseFindIndex
查找数组中的索引
```js
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  const { length } = array
  let index = fromIndex + (fromRight ? 1 : -1)

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index
    }
  }
  return -1
}
```
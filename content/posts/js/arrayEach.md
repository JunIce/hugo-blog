---
title: "ArrayEach"
date: 2021-09-28T20:06:39+08:00
draft: false
tags: ["JS", "lodash"]
---
## ArrayEach实现循环

用`while`中的`break`实现原来`Array.prototype.forEach`未实现的打断功能
```js
function arrayEach(array, iteratee) {
  // 从左往右
  let index = -1
  const length = array.length
  // 从右往做, 换个思路
  /**
   *  let length = array == null ? 0 : array.length
   *  
   *  while(length--) {
   *    if(iteratee(array[length], index, array) === false) ...
   *  }
  */

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break
    }
  }
  return array
}
```

```js
let a = [1,2,3,4]
arrayEach(a, (item) => {
  console.log(item)
  return item < 2
}) // 1、2


a.forEach(item => {
  console.log(item)
  return item > 1
}) // 1、2、3、4
```







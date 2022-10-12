---
title: "比较两个数组的不同项"
date: 2022-10-12T08:52:11+08:00
tags: ["js"]
categories: ["js"]
draft: false
---



# 比较两个数组的不同项

如何比较两个数组的不同项，并且取出组成一个新的数组



```javascript
function diffArray(one, two) {
  if (!Array.isArray(two)) {
    return one.slice();
  }

  var tlen = two.length
  var olen = one.length;
  var idx = -1;
  var arr = [];

  while (++idx < olen) {
    var ele = one[idx];

    var hasEle = false;
    for (var i = 0; i < tlen; i++) {
      var val = two[i];

      if (ele === val) {
        hasEle = true;
        break;
      }
    }

    if (hasEle === false) {
      arr.push(ele);
    }
  }
  return arr;
}
```


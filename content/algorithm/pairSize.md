---
title: "00_获取pair的size"
date: 2022-10-19T08:49:56+08:00
draft: true
categories: ["algorithm"]
---



```typescript
function getPairSize(arr: number[], target: number): number {
  let result: Record<string, any> = {};
  let pair = new Set();
  for (let i = 0; i < arr.length; i++) {
    let c = target - arr[i];
    if (result[c] == undefined) {
      result[arr[i]] = false;
    } else if (result[c] == false) {
      pair.add([arr[i], c]);
      result[arr[i]] = true;
      result[c] = true;
    }
  }

  return pair.size;
}

const a = getPairSize(
  [1, 9, 3, 3, 46, 2, 20, 27, 45, 44, 2, 1],
  47
);
console.log(a);
```
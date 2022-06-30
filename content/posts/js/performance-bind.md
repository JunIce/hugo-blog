
---
title: "performance"
date: 2022-06-27T17:11:11+08:00
draft: true
tags: ["bind"]
---



```js
function test(f) {
    console.time()
    let i = 0
    while (i++ < 1e6) {
        f()
    }
    console.timeEnd()
}
test(performance.now.bind(performance))
test(()=>performance.now())
```
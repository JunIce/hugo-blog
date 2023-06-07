---
title: "scss常见问题总结"
date: 2023-06-05T16:31:19+08:00
draft: true
categories: ["scss"]
---

# scss常见问题总结


## 自增

```scss
@function foo($bar: 1){
  $bar: $bar + 1;
  @return $bar;
}
```
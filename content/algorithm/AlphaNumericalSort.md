---
title: "AlphaNumericalSort"
date: 2023-06-23T18:46:37+08:00
draft: true
tags: ['sort']
categories: ["algorithm"]
---


# AlphaNumericalSort


比如2个字符排序
- z11
- z2


如果按字母顺序排序， 应该是

```shell
1. z11
2. z2
```

如果是自然排序

```shell
1. z2
2. z11
```




## Code

```javascript
const alphaNumericalSort = (a, b) => {
  return a.localeCompare(b, undefined, { numeric: true })
}
```

这里利用`localeCompare`这个字符串的api进行比对


### localeCompare

```javascript
String.prototype.localeCompare(compareString, locales, options)
```

最终返回一个数字  0， 1， -1

0： 相等
1： compareString之后
-1: compareString之前

- compareString: 对比的字符串

- locales: Intl.Collator 的locale

- options: Intl.Collator 的options



[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)

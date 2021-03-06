---
title: "js中的位运算符号"
date: 2022-02-09T11:10:00+08:00
draft: true
tags: ["javascript"]
---


计算机中的有符号数都是以补码的形式存在的

## 位与（AND）&

> 1 & 3 => 1

```js
1 => 0000 0001
3 => 0000 0011

// result

0000 0001 => 1
```

## 位或（OR）|

> 1 | 3 => 3

```js
1 => 0000 0001
3 => 0000 0011

// result

0000 0011 => 3
```

## 位异或(XOR) ^

> 1 ^ 3 => 2

```js
1 => 0000 0001
3 => 0000 0011

// result

0000 0010 => 2
```

## 位非（NOT）~

> ~3 => -4

- 3的二进制为： 00000011
- ~2 按位取反后为：11111100
- 由于计算机中所有有符号数都是以补码的形式存在，所有进行转换。
- 11111100的反码为10000011
- 10000011的补码为10000100
- 1000100对应十进制为-4

```js
3 => 0000 0011
3[反] => 1111 1100 
// 负数取反，首位不变
3[反][反] => 1000 0100
// result
1000 0100 => -4
```

按位非操作的本质：操作数的负值减1.

## 带符号右移（Left shift）>> 

> 3 >> 1 => 1

```js
3 => 0000 0011
3[右移1位] => 0000 0001

// result
0000 0001 => 1
```

## 补零右移（Left shift）>>> 

> 19 >>> 2 => 4

```js
19 => 0001 0011
19[右移2位] => 0000 0100

// result
0000 0100 => 4
```

## 左移（Left shift）<<

> 3 << 1 => 6

```js
3 => 0000 0011
3[左移1位] => 0000 0110

// result
0000 0110 => 6
```
---
title: "Benchmark.js 使用"
date: 2023-03-18T20:06:39+08:00
draft: false
tags: ["Benchmark"]
---


## Benchmark.js


### 安装


> npm install benchmark


### 使用


```js
var Benchmark = require("benchmark");

var suite = Benchmark.Suite("string");

suite
	.add("String#regexp", function () {
		/o/.test("Hello World!");
	})
	.add("String#indexOf", function () {
		"Hello World!".indexOf("o") > -1;
	})
	.add("String#lastIndexOf", function () {
		"Hello World!".lastIndexOf("o") > -1;
	})
	.add("String#startsWith", function () {
		"Hello World!".startsWith("Hello");
	})
	.add("String#endsWith", function () {
		"Hello World!".endsWith("Hello");
	})
	.on("cycle", function (event) {
		console.log(String(event.target));
	})
	.run({ async: true });

```


#### 输出

```perl
String#regexp x 27,318,384 ops/sec ±1.33% (91 runs sampled)
String#indexOf x 520,992,635 ops/sec ±1.40% (81 runs sampled)
String#lastIndexOf x 19,399,469 ops/sec ±0.22% (92 runs sampled)
String#startsWith x 38,492,366 ops/sec ±0.26% (93 runs sampled)
String#endsWith x 47,208,542 ops/sec ±0.21% (93 runs sampled)
```
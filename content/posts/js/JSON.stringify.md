---
title: "JSON.stringify方法"
date: 2022-06-27T12:09:11+08:00
tags: ["JSON.stringify"]
categories:
draft: false
---



## JSON.parse



> ```js
> JSON.parse(text[, reviver])
> ```





### reviver

转换器，如果传入该参数 (函数)，可以用来修改解析生成的原始值，调用时机在 parse 函数返回之前。

解析值本身以及它所包含的所有属性，会按照一定的顺序（从最最里层的属性开始，一级级往外，最终到达顶层，也就是解析值本身）分别的去调用 `reviver` 函数

**从最内层开始，按照层级顺序，依次向外遍历**



## JSON.stringify



> ```js
> JSON.stringify(value[, replacer [, space]])
> ```



### value转换规则



- 值如果有 `toJSON()` 方法，按`toJSON`方法输出。
- 非数组对象的属性 转换后顺序不固定。
- 布尔值、数字、字符串会转换成原始值。
- 常规对象中`undefined`、函数以及 `symbol` ，会被忽略
- 数组中 `undefined`、函数以及 `symbol` 会 被转换成 `null`。
- 函数、`undefined` 被单独转换时，会返回` undefined`。
- 循环引用的对象会报错。
-  `symbol` 属性键的属性都会被移除。
- Date 会转为字符串。
- `NaN 、Infinity 、 null` 都会被当做 null。
- `Map/Set/WeakMap/WeakSet`，仅会序列化可枚举的属性。





### replacer



2个参数，包括key和value



```js
function replacer(key, value) {
  if (typeof value === "string") {
    return undefined;
  }
  return value;
}

var foo = {foundation: "Mozilla", model: "box", week: 45, transport: "car", month: 7};
var jsonString = JSON.stringify(foo, replacer); // {"week":45,"month":7}
```



### space



参数用来控制结果字符串里面的间距, 用来格式化json



```js
JSON.stringify({ a: 2 }, null, " ");   // '{\n "a": 2\n}'
```






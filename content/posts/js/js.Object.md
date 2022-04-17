---
title: "js -- Object对应API详解"
date: 2022-04-08T21:36:37+08:00
draft: true
tags: ["js"]
categories: ["js"]
---



# Object





## Object.assign



拷贝源对象自身的并且可枚举的属性到目标对象。

该对象会调用源对象的`[[Get]]`函数和目标对象的`[[Set]]`函数。所以它会调用相关 getter 和 setter

- 如果合并源包含getter，这可能使其不适合将新属性合并到原型中。
- 原始类型会被包装，null 和 undefined 会被忽略。



**Object.assign()方法只能拷贝源对象的可枚举的自身属性，同时拷贝时无法拷贝属性的特性们，而且*访问器属性会被转换成数据属性*，也无法拷贝源对象的原型，**



## Object.create



会使用现有对象作为新创建对象的`__proto__`

> Object.create(null)  => {} 返回一个空对象，不包含__proto__



## Object.defineProperties



在现有对象上定义新的属性或者改变修改现有属性



> Object.defineProperties(target, props)



可以同时定义多个属性





## Object.defineProperty



直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。



> Object.defineProperty(target, key, props)



添加的属性是可以被枚举的`for ... in...`



## Object.entries



返回自身可枚举属性的键值对数组，其排列与使用 [`for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 循环遍历该对象时返回的顺序一致（区别在于 for-in 循环还会枚举原型链中的属性）



> Object.entries(obj).forEach( ([key, value]) => {
>
> ​	// ...
>
> })





## Object.freeze()



冻结对象, 使对象上的属性不能被添加、修改、删除， 对象的原型也不能被修改

返回冻结后的对象



> Object.freeze(target) 



数组作为一个对象，被冻结后数组不能添加元素或者删除元素





## Object.fromEntries



可以把键值对数组转换成对象



```js
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42]
]);

const obj = Object.fromEntries(entries);

console.log(obj);
// expected output: Object { foo: "bar", baz: 42 }
```







## Object.getOwnPropertyDescriptor



返回指定对象上一个自有属性对应的属性描述符





## Object.getOwnPropertyDescriptors



返回对象上的所有属性对应的描述符





## Object.getOwnPropertyNames



返回一个由指定对象的所有自身属性的属性名，包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组



> ```js
> Object.getOwnPropertyNames(obj)
> ```





### 获取自身不可枚举属性



```js
let enumKeys = Object.keys(target)
let allKeys = Object.getOwnPropertyNames(target)
let nonenum_only = allKeys.filter(key => enumKeys.indexOf(key) == -1)
```



## Object.keys



`Object.keys()` 方法会返回一个由一个给定对象的**自身可枚举**属性组成的数组





## Object.getOwnPropertySymbols



返回一个给定对象自身的所有 Symbol 属性的数组。





## Object.getPrototypeOf



返回指定对象的原型, 内部`[[Prototype]]`属性的值）



**返回值**： 给定对象的原型。





## Object.hasOwnProperty



判断是否包含某个属性，返回一个布尔值



> Object.hasOwnProperty(prop) => boolean





## Object.is



判断两个对象是否相等


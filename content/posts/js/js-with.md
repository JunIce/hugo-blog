---
title: "js -- with语法"
date: 2022-04-14T09:17:16+08:00
draft: true
---





# with



在看`vue3`单文件编译的时候时看到



可以用作扩展statement 的作用域链



```js
with(express) {
	statement
}
```



例如在`with`中注入`console`, 以下语句中就可直接使用`log`方法

```js
with (console) {
	log('I dont need the "console." part anymore!')
}
```



同时通过`with`嵌套可以同时注入返回值的对象



`with`语句使得代码不易阅读，同时使得JavaScript编译器难以在作用域链上查找某个变量，难以决定应该在哪个对象上来取值



```js
function(min, max) {
	with(Math) {
		console.log(min+max) // Nan
	}
}
```



这里就会报错了，会优先使用`Math`上的属性



## 用途



### 前端沙盒



由于with定义的上下文会优先查找



```
const sandboxCode = `with(scope){ ${code} }`

new Function('scope', sandboxCode)
```





### 前端模板引擎



模板引擎中一些特殊的forEach，map方法

可以使用`with`进行注入



## 误区

`with`会注入上下文的属性

```js

with({ run: () => {} }) {
	
}

```



表面上只是注入了`run`方法

实际上由于`with`会在整个原型链上查找，因此会注入很多不必要的属性



所以如果需要一个纯净的对象，使用`Object.create(null)`创建









----

##### 引用



##### [with - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with)



[精读《JS with 语法》 ](https://zhuanlan.zhihu.com/p/397800013)


---
title: "webpack 模块加载原理"
date: 2022-07-29T05:59:58+08:00
tags: ["webpack模块加载"]
categories: ["webpack"]
draft: false
---

# webpack模块加载原理



webpack是前端开发中一个非常重要的工具，总体来说就是一个模块打包器，可以把项目中所用到的资源打包成一个或多个bundle



## 项目

新建项目

```javascript
// webpack.config.js
module.exports = {
  mode: "development",
  entry: "./index.js",
  output: {
    filename: "bundle.js",
  },
};

```

入口文件

```javascript
//index.js
import { bar, foo } from "./foo";

foo();

bar();

```

依赖文件

```javascript
// foo.js
export const foo = () => {
  console.log("say foo");
};

export const bar = async () => {
  await Promise.resolve(123);
};

```

bundle结果

```javascript
// 删减后的结果
 (function() { // webpackBootstrap
 	"use strict";
 	var __webpack_modules__ = ({
        "./foo.js": (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            eval("");
        }),
        "./index.js": (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            eval("");
        })

 	});

 	// The module cache
 	var __webpack_module_cache__ = {};
 	
 	// The require function
 	function __webpack_require__(moduleId) {
 		// Check if module is in cache
 		var cachedModule = __webpack_module_cache__[moduleId];
 		if (cachedModule !== undefined) {
 			return cachedModule.exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = __webpack_module_cache__[moduleId] = {
 			// no module.id needed
 			// no module.loaded needed
 			exports: {}
 		};
 	
 		// Execute the module function
 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
 	
 		// Return the exports of the module
 		return module.exports;
 	}
 	

 	/* webpack/runtime/define property getters */
 	!function() {
 		// define getter functions for harmony exports
 		__webpack_require__.d = function(exports, definition) {
 			for(var key in definition) {
 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
 				}
 			}
 		};
 	}();
 	
 	/* webpack/runtime/hasOwnProperty shorthand */
 	!function() {
 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
 	}();
 	
 	/* webpack/runtime/make namespace object */
 	!function() {
 		// define __esModule on exports
 		__webpack_require__.r = function(exports) {
 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
 			}
 			Object.defineProperty(exports, '__esModule', { value: true });
 		};
 	}();
 	
 	// startup
 	var __webpack_exports__ = __webpack_require__("./index.js");
 })();
```



首先看一下整体结构, 是一个自执行函数

```javascript
(function(){
  // ...code
})()
```



我们来分析一下最终bundle出来的结果

- 第一步，定义了一个`__webpack_modules__`对象，对象的`key`就是所价值的文件名，`value`是一个函数，内部用eval方法执行
- `__webpack_module_cache__`内部定义一个模块的cache，看注释是模块缓存
- 定义了一个方法`__webpack_require__`，以及函数上对应的多个其他方法
- 执行 `__webpack_require__("./index.js")`入口方法

可以看出，执行了最后的入口方法，其实就是执行了最终`index.js`下`eval`的字符串



### `__webpack_require__`

```javascript
function __webpack_require__(moduleId) {
 		// Check if module is in cache
 		var cachedModule = __webpack_module_cache__[moduleId];
 		if (cachedModule !== undefined) {
 			return cachedModule.exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = __webpack_module_cache__[moduleId] = {
 			// no module.id needed
 			// no module.loaded needed
 			exports: {}
 		};
 	
 		// Execute the module function
 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
 	
 		// Return the exports of the module
 		return module.exports;
 	}
```



`__webpack_require__`其实就做了一件事

- 从缓存中寻找相关记录，如果有记录，就返回缓存
- 没有缓存，则定义相关缓存
- 从`__webpack_modules__`执行相关代码，并且把结果赋值给缓存，并返回结果



## 其他几个方法



### `__webpack_require__.d`

在对象上定义相关方法，`Object.defineProperty`, 并且定义get方法



### `__webpack_require__.o`

`Object.hasOwnProperty`方法的重新写，判断对象上是否含有属性



### `__webpack_require__.r`

在对象上定义一个`__esModule`属性， 并把值设为true



## eval内的值

index.js

```javascript
"__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _foo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./foo */ \"./foo.js\");\n\n\n(0,_foo__WEBPACK_IMPORTED_MODULE_0__.foo)();\n\n(0,_foo__WEBPACK_IMPORTED_MODULE_0__.bar)();\n\n\n//# sourceURL=webpack://app2/./index.js?"
```

格式化后

```javascript
__webpack_require__.r(__webpack_exports__);
/* harmony import */ 
var _foo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./foo */ "./foo.js");
(0,_foo__WEBPACK_IMPORTED_MODULE_0__.foo)();
(0,_foo__WEBPACK_IMPORTED_MODULE_0__.bar)();
//# sourceURL=webpack://app2/./index.js?
```



- 先给模块定义`__esModule`属性
- 引用`foo.js`模块

`foo.js`格式化后

```javascript
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
  /* harmony export */
  bar: function () {
    return /* binding */ bar;
  },
  /* harmony export */
  foo: function () {
    return /* binding */ foo;
  },
  /* harmony export */
});
const foo = () => {
  console.log("say foo");
};
const bar = async () => {
  await Promise.resolve(123);
};
//# sourceURL=webpack://app2/./foo.js?

```

原理和上面类似






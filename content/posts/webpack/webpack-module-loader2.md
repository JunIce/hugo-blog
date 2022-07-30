---
title: "webpack 模块加载原理(二)"
date: 2022-07-29T05:59:58+08:00
tags: ["webpack模块加载"]
categories: ["webpack"]
draft: false

---

# webpack模块加载原理(二)





## 异步加载原理



### 示例

入口文件中改变引用后执行方式

```javascript
// index.js
import("./foo").then((foo) => {
  foo.bar();
  foo.foo();
});
```



打开浏览器引用`bundle.js`后可以看到，请求完`bundle.js`后再次请求了`foo_js.bundle.js`

![image-20220729211912764](http://cdn.storycn.cn/blog/image-20220729211912764.png)



### 分析

找到bundle后的入口地址

```javascript
var __webpack_modules__ = ({
	"./index.js": (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
	eval("__webpack_require__.e(/*! import() */ \"foo_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./foo */ \"./foo.js\")).then((foo) => {\n  foo.bar();\n  foo.foo();\n});\n\n\n//# sourceURL=webpack://app2/./index.js?");
})
```



格式完字符串

```javascript
__webpack_require__.e(/*! import() */ "foo_js")
  .then(__webpack_require__.bind(__webpack_require__, "./foo.js"))
  .then((foo) => {
    foo.bar();
    foo.foo();
  });

//# sourceURL=webpack://app2/./index.js?

```



### `__webpack_require__.e`源码

我们看看这个`__webpack_require__.e`究竟是如何实现的

```javascript
!function() {
    __webpack_require__.f = {};
    // This file contains only the entry chunk.
    // The chunk loading function for additional chunks
    __webpack_require__.e = function(chunkId) {
        return Promise.all(Object.keys(__webpack_require__.f).reduce(function(promises, key) {
            __webpack_require__.f[key](chunkId, promises);
            return promises;
        }, []));
    };
}();
```



- `__webpack_require__.e`也是一个自执行函数包裹的，内部定义了一个`__webpack_require__.f`
- `__webpack_require__.e`内部返回了一个Promise
- Promise.all参数是收集了`__webpack_require__.f`这个对象的执行结果，可以推测该对象的value都是返回的promise



### `__webpack_require__.f`源码

`__webpack_require__.f`是一个对象, 在`e`函数中对`f`函数进行遍历执行

```javascript
var installedChunks = {
      main: 0,
};
__webpack_require__.f.j = function (chunkId, promises) {
  // JSONP chunk loading for javascript
  var installedChunkData = __webpack_require__.o(installedChunks, chunkId)
    ? installedChunks[chunkId]
    : undefined;
  if (installedChunkData !== 0) {
    // 0 means "already installed".

    // a Promise means "currently loading".
    if (installedChunkData) {
      // 这里的promises参数，其实是e函数中reduce的那个初始变量的引用，在e函数中组装成了promise的数组
      promises.push(installedChunkData[2]);
    } else {
      if (true) {
        // all chunks have JS
        // setup Promise in chunk cache
        var promise = new Promise(function (resolve, reject) {
          installedChunkData = installedChunks[chunkId] = [resolve, reject];
        });
        promises.push((installedChunkData[2] = promise));

        // start chunk loading
        var url = __webpack_require__.p + __webpack_require__.u(chunkId);
        // create error before stack unwound to get useful stacktrace later
        var error = new Error();
        var loadingEnded = function (event) {
          if (__webpack_require__.o(installedChunks, chunkId)) {
            installedChunkData = installedChunks[chunkId];
            if (installedChunkData !== 0)
              installedChunks[chunkId] = undefined;
            if (installedChunkData) {
              var errorType =
                event && (event.type === "load" ? "missing" : event.type);
              var realSrc = event && event.target && event.target.src;
              error.message =
                "Loading chunk " +
                chunkId +
                " failed.\n(" +
                errorType +
                ": " +
                realSrc +
                ")";
              error.name = "ChunkLoadError";
              error.type = errorType;
              error.request = realSrc;
              installedChunkData[1](error);
            }
          }
        };
        __webpack_require__.l(
          url,
          loadingEnded,
          "chunk-" + chunkId,
          chunkId
        );
      } else installedChunks[chunkId] = 0;
    }
  }
};
```



`installedChunks`是安装完的chunk数据的记录map

- undefined ： chunk 尚未加载
- null：chunk预加载
- 0: 表示chunk加载完毕
- Promise： chunk加载中



chunk加载中时，push到promise数组中

```javascript
promises.push(installedChunkData[2]);
```



如果chunk状态不存在时，通过`__webpack_require__.l`进行模块加载，其实内部使用的就是**jsonp**的形式进行模块加载



### `__webpack_require__.l`

函数内动态创建script标签，并且把标签插入到head中，执行加载完毕的回调函数

```javascript
!(function () {
  var inProgress = {};
  var dataWebpackPrefix = "app2:";
  // loadScript function to load a script via script tag
  __webpack_require__.l = function (url, done, key, chunkId) {
    if (inProgress[url]) {
      inProgress[url].push(done);
      return;
    }
    var script, needAttach;
    if (key !== undefined) {
      // 判断现有head中是否存在相同路径的chunk
      var scripts = document.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++) {
        var s = scripts[i];
        if (
          s.getAttribute("src") == url ||
          s.getAttribute("data-webpack") == dataWebpackPrefix + key
        ) {
          script = s;
          break;
        }
      }
    }
    if (!script) {
      // 动态创建script标签
      needAttach = true;
      script = document.createElement("script");

      script.charset = "utf-8";
      script.timeout = 120;
      if (__webpack_require__.nc) {
        script.setAttribute("nonce", __webpack_require__.nc);
      }
      script.setAttribute("data-webpack", dataWebpackPrefix + key);
      script.src = url;
    }
    inProgress[url] = [done];
    var onScriptComplete = function (prev, event) {
      // avoid mem leaks in IE.
      script.onerror = script.onload = null;
      clearTimeout(timeout);
      var doneFns = inProgress[url];
      delete inProgress[url];
      script.parentNode && script.parentNode.removeChild(script);
      // 执行回调函数
      doneFns &&
        doneFns.forEach(function (fn) {
          return fn(event);
        });
      if (prev) return prev(event);
    };
    var timeout = setTimeout(
      onScriptComplete.bind(null, undefined, {
        type: "timeout",
        target: script,
      }),
      120000
    );
    // 监听script加载完毕的事件和错误事件
    script.onerror = onScriptComplete.bind(null, script.onerror);
    script.onload = onScriptComplete.bind(null, script.onload);
    needAttach && document.head.appendChild(script);
  };
})();
```



加载完毕会调用到`loadingEnded`方法， 其中会判断当前chunk的加载状态，如果有状态值不为空，则会抛出对应的Error错误

```javascript
var loadingEnded = function (event) {
    if (__webpack_require__.o(installedChunks, chunkId)) {
      installedChunkData = installedChunks[chunkId];
      if (installedChunkData !== 0)
        installedChunks[chunkId] = undefined;
      if (installedChunkData) {
        var errorType =
          event && (event.type === "load" ? "missing" : event.type);
        var realSrc = event && event.target && event.target.src;
        error.message =
          "Loading chunk " +
          chunkId +
          " failed.\n(" +
          errorType +
          ": " +
          realSrc +
          ")";
        error.name = "ChunkLoadError";
        error.type = errorType;
        error.request = realSrc;
        installedChunkData[1](error);
      }
    }
  };
```



### `__webpack_require__.u`

返回当前chunk对应的文件名

### `__webpack_require__.g`

自执行函数，返回当前的运行环境的顶层对象

```javascript
/* webpack/runtime/global */
!function() {
  __webpack_require__.g = (function() {
    if (typeof globalThis === 'object') return globalThis;
    try {
      return this || new Function('return this')();
    } catch (e) {
      if (typeof window === 'object') return window;
    }
  })();
}();
```





## 分包模块



foo_js.bundle.js

```javascript
"use strict";

(self["webpackChunkapp2"] = self["webpackChunkapp2"] || []).push([
  ["foo_js"],
  {
    "./foo.js": function (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) {
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ bar: function () {
          return /* binding */ bar;
        },
        /* harmony export */ foo: function () {
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

      //# sourceURL=webpack://app2/./foo.js?"
    },
  },
]);

```



分包中是一个函数，往一个全局变量中push了一个数组

数组包含2个参数，

- 分包模块的名字组成的数组
- 分包模块内容组成的对象





回到主bundle中

```javascript
var chunkLoadingGlobal = (self["webpackChunkapp2"] =
  self["webpackChunkapp2"] || []);
chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
chunkLoadingGlobal.push = webpackJsonpCallback.bind(
  null,
  chunkLoadingGlobal.push.bind(chunkLoadingGlobal)
);
```



`chunkLoadingGlobal`对`push`函数进行了重写，其实是调用了`webpackJsonpCallback`,再去回调真实的push函数的



### webpackJsonpCallback

- parentChunkLoadingFunction: 覆盖的真实的push回调函数
- data： 分包中push传入的真实参数

```javascript
var webpackJsonpCallback = function (parentChunkLoadingFunction, data) {
  var chunkIds = data[0];
  var moreModules = data[1];
  var runtime = data[2];
  // add "moreModules" to the modules object,
  // then flag all "chunkIds" as loaded and fire callback
  var moduleId,
    chunkId,
    i = 0;
  if (
    chunkIds.some(function (id) {
      return installedChunks[id] !== 0;
    })
  ) {
    for (moduleId in moreModules) {
      if (__webpack_require__.o(moreModules, moduleId)) {
        __webpack_require__.m[moduleId] = moreModules[moduleId];
      }
    }
    if (runtime) var result = runtime(__webpack_require__);
  }
  if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
  for (; i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    if (
      __webpack_require__.o(installedChunks, chunkId) &&
      installedChunks[chunkId]
    ) {
      installedChunks[chunkId][0]();
    }
    installedChunks[chunkId] = 0;
  }
};
```



chunkIds中存在chunk还没有加载的，会在这里进行加载

```javascript
if (
  chunkIds.some(function (id) {
    return installedChunks[id] !== 0;
  })
) {
  // 遍历对应modules的map
  for (moduleId in moreModules) {
    if (__webpack_require__.o(moreModules, moduleId)) {
      // 安装到全局modules上
      __webpack_require__.m[moduleId] = moreModules[moduleId];
    }
  }
  if (runtime) var result = runtime(__webpack_require__);
}
```



回调push删除

```javascript
if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
```



执行对应分包的模块，分包状态重置

```javascript
for (; i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    if (
      __webpack_require__.o(installedChunks, chunkId) &&
      installedChunks[chunkId]
    ) {
      // 从安装的map中找到对应的bundle，并执行函数
      installedChunks[chunkId][0]();
    }
  	// 执行完毕，赋值为0
    installedChunks[chunkId] = 0;
  }
```



模块异步加载完毕
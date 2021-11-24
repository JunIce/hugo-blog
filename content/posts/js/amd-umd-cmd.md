---
title: "Amd Umd Cmd CommonJS 区别和联系"
date: 2021-11-23T14:48:12+08:00
draft: true
---

## CommonJS

CommonJs

加载模块使用`require`方法， `node.js`采用了这个规范

```js
// foobar.js
 
//私有变量
var test = 123;
 
//公有方法
function foobar () {
 
    this.foo = function () {
        // do someing ...
    }
    this.bar = function () {
        //do someing ...
    }
}
 
//exports对象上的方法和变量是公有的
var foobar = new foobar();
exports.foobar = foobar;
```

```js
//require方法默认读取js文件，所以可以省略js后缀
var test = require('./boobar').foobar;
 
test.bar();
```

## AMD

`AMD` 是 `RequireJS` 在推广过程中对模块定义的规范化产出

`require.js` 浏览器端， `AMD` 是提前执行

> define(id?, dependencies?, factory);

- 第一个参数 id 为字符串类型，表示了模块标识，为可选参数。若不存在则模块标识应该默认定义为在加载器中被请求脚本的标识。如果存在，那么模块标识必须为顶层的或者一个绝对的标识。

- 第二个参数，dependencies ，是一个当前模块依赖的，已被模块定义的模块标识的数组字面量。

- 第三个参数，factory，是一个需要进行实例化的函数或者一个对象。

```js
define("alpha", [ "require", "exports", "beta" ], function( require, exports, beta ){
    export.verb = function(){
        return beta.verb();
        // or:
        return require("beta").verb();
    }
});
```

## CMD

`CMD` 是 `SeaJS` 在推广过程中对模块定义的规范化产出

`AMD` 推崇依赖前置，`CMD` 推崇依赖就近。

```js
define(function (requie, exports, module) {
     
    //依赖可以就近书写
    var a = require('./a');
    a.test();
     
    ...
    //软依赖
    if (status) {
     
        var b = requie('./b');
        b.test();
    }
});
```


> AMD与CDM的区别：\
>（1）对于于依赖的模块，AMD 是提前执行(好像现在也可以延迟执行了)，CMD 是延迟执行。 \
>（2）AMD 推崇依赖前置，CMD 推崇依赖就近。\
>（3）AMD 推崇复用接口，CMD 推崇单用接口。\
>（4）书写规范的差异。

## UMD

`umd`是`AMD`和`CommonJS`的糅合

UMD先判断是否支持Node.js的模块（exports）是否存在，存在则使用Node.js模块模式。

在判断是否支持AMD（define是否存在），存在则使用AMD方式加载模块。
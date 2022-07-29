---
title: "Webpack Tapable插件机制源码解读"
date: 2022-02-05T10:08:32+08:00
draft: true
tags: ["webpack", "tapable"]
categories: ["webpack"]
---



# webpack -- Tapable



`webpack`是前端工具链中非常重要的一环，常规前端项目都会用到非常多的`webpack`插件，而其中`tapable`是实现插件机制的重要工具，已经独立出一个单独的项目进行维护了



https://github.com/webpack/tapable



这里看的源码版本是



> "version": "2.2.1"



## 使用



1. 实例化是传入参数列表
2. 实例上调用`tap`方法注册方法
3. 实例上调用`call`方法进行调用，并且第二个参数传入对应的参数



```javascript
const hook = new SyncHook(["arg1", "arg2"]);

const mockCall = jest.fn();
const mock0 = jest.fn();
const mockRegister = jest.fn(x => ({
  name: "huh",
  type: "sync",
  fn: mock0
}));

const mock1 = jest.fn();
hook.tap("Test1", mock1);

hook.intercept({
  call: mockCall,
  register: mockRegister
});

const mock2 = jest.fn();
hook.tap("Test2", mock2);

hook.call(1, 2);
```





## 勾子列表



| Hook Name                | 执行方式 | 备注                                                         |
| ------------------------ | -------- | ------------------------------------------------------------ |
| SyncHook                 | 同步执行 | 不关心监听函数的返回值                                       |
| SyncBailHook             | 同步串行 | 只要监听函数中有一个函数的返回值不为 null,则跳过剩余逻辑     |
| SyncWaterfallHook        | 同步串行 | 上一个监听函数的返回值将作为参数传递给下一个监听函数         |
| SyncLoopHook             | 同步串行 | 当监听函数被触发的时候，如果该监听函数返回 true 时则这个监听函数会反复执行，如果返回 undefined 则表示退出循环 |
| AsyncParallelHook        | 异步并行 | 不关心监听函数的返回值                                       |
| AsyncParallelBailHook    | 异步并行 | 只要监听函数的返回值不为 null，就会忽略后面的监听函数执行，直接跳跃到 callAsync 等触发函数绑定的回调函数，然后执行这个被绑定的回调函数 |
| AsyncSeriesHook          | 异步并行 | 不关心 callback()的参数                                      |
| AsyncSeriesBailHook      | 异步并行 | callback()的参数不为 null，就会直接执行 callAsync 等触发函数绑定的回调函数 |
| AsyncSeriesWaterfallHook | 异步并行 | 上一个监听函数的中的 callback(err, data)的第二个参数,可以作为下一个监听函数的参数 |



## Hook 勾子基类



hook中最重要的就是声明了三种不同的hook调用方式，其实就是在hook列表中对应的type不同



```js
class Hook {
  constructor(args = [], name = undefined) {
    this._args = args;
    this.name = name;
    this.taps = [];
    this.interceptors = [];
    this.tap = this.tap;
    this.tapAsync = this.tapAsync;
    this.tapPromise = this.tapPromise;
  }

  // ...

  _tap(type, options, fn) {
    /**
        options = {
            name: options.trim(),
        };
    */
    options = Object.assign({ type, fn }, options);
    options = this._runRegisterInterceptors(options);
    this._insert(options);
  }

  tap(options, fn) {
    this._tap("sync", options, fn);
  }

  tapAsync(options, fn) {
    this._tap("async", options, fn);
  }

  tapPromise(options, fn) {
    this._tap("promise", options, fn);
  }

  // ...

  _insert(item) {
    // ...
  }
}
```

`Hook`内部通过`this._type`传入不同的`type`实现注册不同类型的`hook`

`options` 组合成数据

```js
options = {
    type,
    fn,
    {
        name: 'hook-name'
    }
}
```

`this._insert(item)`源码

```js
// 重置调用函数
this._resetCompilation();
// before 转成Set数据， 方便使用Set的API
let before;
if (typeof item.before === "string") {
  before = new Set([item.before]);
} else if (Array.isArray(item.before)) {
  before = new Set(item.before);
}

// stage 其实是执行时机
let stage = 0;
if (typeof item.stage === "number") {
  stage = item.stage;
}

let i = this.taps.length;
while (i > 0) {
  i--;
  const x = this.taps[i]; // 最后一个tap
  this.taps[i + 1] = x; // 复制最后一个tap到下标i+1
  const xStage = x.stage || 0; // 拿到x的stage

  // 先判断before
  if (before) {
    // 存在before， 进入
    if (before.has(x.name)) {
      before.delete(x.name); // 删除
      continue; // 重新走循环, 指针前移
    }
    if (before.size > 0) {
      continue; // 重新走循环, 指针前移
    }
  }
  // 再判断stage
  if (xStage > stage) {
    continue;
  }
  i++; // 指针后移一位，插入到i后面
  break;
}
this.taps[i] = item; // 最终赋值
```

由`this._createCall` 创建最终的回调函数

```js
this.compile({
  taps: this.taps,
  interceptors: this.interceptors,
  args: this._args,
  type: type,
});
```

## HookCodeFactory 代码工厂类

核心代码

```js
class HookCodeFactory {
    //...
    create(options) {
		this.init(options);
		let fn;
		switch (this.options.type) {
			case "sync":
				fn = new Function( // ... );
				break;
			case "async":
				fn = new Function( // ....);
				break;
			case "promise":
				fn = new Function( // ....);
				break;
		}
		this.deinit();
		return fn;
	}
}
```

其中最重要的就是这个`new Function`, 由这个函数我们可以初始化函数

### contentWithInterceptors 存在拦截器的

```js
contentWithInterceptors(options) {
    if (this.options.interceptors.length > 0) {
        const onError = options.onError;
        const onResult = options.onResult;
        const onDone = options.onDone;
        let code = "";
        // 遍历拦截器
        for (let i = 0; i < this.options.interceptors.length; i++) { // 遍历
            const interceptor = this.options.interceptors[i]; // 拿到单个拦截器
            if (interceptor.call) { // 存在call方法

                code += `${this.getInterceptor(i)}.call(${this.args({
                    before: interceptor.context ? "_context" : undefined
                })});\n`;
            }
        }

        // 构造回调对象
        code += this.content(
            Object.assign(options, {
                // error回调
                onError:
                    onError &&
                    (err => {
                        let code = "";
                        for (let i = 0; i < this.options.interceptors.length; i++) {
                            const interceptor = this.options.interceptors[i];
                            if (interceptor.error) {
                                code += `${this.getInterceptor(i)}.error(${err});\n`;
                            }
                        }
                        code += onError(err);
                        return code;
                    }),
                // result回调
                onResult:
                    onResult &&
                    (result => {
                        let code = "";
                        for (let i = 0; i < this.options.interceptors.length; i++) {
                            const interceptor = this.options.interceptors[i];
                            if (interceptor.result) {
                                code += `${this.getInterceptor(i)}.result(${result});\n`;
                            }
                        }
                        code += onResult(result);
                        return code;
                    }),
                // done回调
                onDone:
                    onDone &&
                    (() => {
                        let code = "";
                        for (let i = 0; i < this.options.interceptors.length; i++) {
                            const interceptor = this.options.interceptors[i];
                            if (interceptor.done) {
                                code += `${this.getInterceptor(i)}.done();\n`;
                            }
                        }
                        code += onDone();
                        return code;
                    })
            })
        );
        return code;
    } else {
        return this.content(options);
    }
}
```

其中`this.content`由外部继承子类去实现





### callTap



```js
callTap(tapIndex, { onError, onResult, onDone, rethrowIfPossible }) {
    let code = "";
    let hasTapCached = false;
    // 生产拦截器代码
    for (let i = 0; i < this.options.interceptors.length; i++) {
        const interceptor = this.options.interceptors[i];
        if (interceptor.tap) {
            if (!hasTapCached) {
                code += `var _tap${tapIndex} = ${this.getTap(tapIndex)};\n`;
                hasTapCached = true;
            }
            code += `${this.getInterceptor(i)}.tap(${
                interceptor.context ? "_context, " : ""
            }_tap${tapIndex});\n`;
        }
    }
    code += `var _fn${tapIndex} = ${this.getTapFn(tapIndex)};\n`;
    const tap = this.options.taps[tapIndex];
    switch (tap.type) {
        case "sync":
            // 组装同步代码
            break;
        case "async":
            // 组装异步代码
            break;
        case "promise":
            // 组装Promise代码
            break;
    }
    return code;
}
```





## Function



在`MDN`文档中我们可以查到



> new Function ([arg1[, arg2[, ...argN]],] functionBody)



<b>注意</b>: 由 Function 构造器创建的函数不会创建当前环境的闭包，它们总是被创建于全局环境，因此在运行时它们只能访问全局变量和自己的局部变量，不能访问它们被 Function 构造器创建时所在的作用域的变量。





```js
var add = new Function("a", "b", "return a + b");

add(1, 2); // => 3
```

### 

---
title: "Vue 自定义指令的执行机制"
date: 2022-08-24T21:52:51+08:00
tags: ["vue2"]
categories: ["vue"]
draft: false
---



# Vue 自定义指令的执行机制



> version: 2.6.14



## 前情提要



某日，业务需要我需要在按钮点击之前验证某些条件，如果不符合即不执行click内的业务代码。思前想后，写一个指令不就可以了。做到既不改动原有的业务代码，又可以移植。

[示例代码](https://code.juejin.cn/pen/7135444502663135245)

```vue
<template>
  <button v-capture @click="handleClick">button</button>
</template>
<script>
  export default {
    methods: {
      handleClick(){
        console.log(1)
      }
    },
    directives: {
      capture: {
        bind(el) {
          el.captureHandler = (e) => {
            // 验证条件
            console.log(2)
            e.stopPropagation()
          };
          el.addEventListener("click", el.captureHandler);
        },
        unbind(el) {
          el.removeEventListener("click", el.captureHandler);
        }
      }
    }
}
</script>
```



以上就是伪代码，乍一看没啥问题。

实际一运行，发现1和2都打印出来了，而且1还是在2之前运行的。

这样一看模版上绑定的事件执行是在自定义指令绑定事件之前的。

翻开谷歌，也没有找到相关案例。



## DOM绑定



我们都知道vue的SFC最终还是会被编译成js文件，最终模板会被编译成vnode,

元素上绑定的事件会转换成vnode上的一个对象

```javascript
{
  // ....
  on: {
    click: 'handleClick'
  }
}
```



### 源码

那就找一找这个对象在哪边使用的

runtime中搜索`addEventListener`, 因为这个事件绑定上DOM中才有的事件，所以只会在web中了

```javascript
// src/platforms/web/runtime/modules/events.js
export default {
  create: updateDOMListeners,
  update: updateDOMListeners,
  destroy: (vnode: VNodeWithData) => updateDOMListeners(vnode, emptyNode)
}
```

具体实现就先不管

`updateDOMListeners`中通过调用了`updateListeners`方法，把事件绑定到元素上去

还有就是返回了一个对象，包括create、update、destroy, 这不是很像vue的生命周期函数命名嘛



根据文件依次向上找👆

最终在`modules/index.js`中导出了

```javascript
export default [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
]
```



`modules`最终在哪里使用的？

-----

就是大名鼎鼎的`patch.js`

```javascript
// src/core/vdom/patch.js

const { modules, nodeOps } = backend

for (i = 0; i < hooks.length; ++i) {
  cbs[hooks[i]] = []
  for (j = 0; j < modules.length; ++j) {
    if (isDef(modules[j][hooks[i]])) {
      cbs[hooks[i]].push(modules[j][hooks[i]])
    }
  }
}
```



函数一上来就把modules进行分类，把原来modules上的相关的对象进行合并，

最终cbs会变成一个对象

```javascript
const cbs = {
  create: [fn1, fn2, fn3],
  update: [fn1, fn2, fn3],
  destroy: [fn1, fn2, fn3],
}
```



具体的执行的时机就不说了



## directive

指令是vue的一大特色了，源于angularjs中就有指令这个东西了，vue3中依旧保留了下来

指令中对应以下几个方法，也可以说是生命周期了

```javascript
directives: {
  name: {
		bind(){},
    insert(){},
    inserted(){},
    componentUpdated(){},
    update(){},
    unbind(){},
  }
}
```



接下来找找指令是什么时候初始化的

全局查找`directives`, 其实就这一个文件，那就是它了

```javascript
// src/core/vdom/modules/directives.js
{
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode: VNodeWithData) {
    updateDirectives(vnode, emptyNode)
  }
}
```



可以明显看到它也是在`create`内部周期上调用了`bind`方法了

```js
callHook(dir, 'bind', vnode, oldVnode)
```



## 为什么先调用模版绑定的方法，再调用指令的方法



回到`patch.js`, 可以看到模块在这里进行了合并，把平台相关的模块放在前面，基础指令和ref放在后面执行了。

同时官方也进行了注释，**先执行内置的方法再执行指令的方法**。

```js
// src/platforms/web/runtime/patch.js
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)
```



还是注释没仔细看，这个文件打开过多少次了。😭



## 改了就可以了吗

依旧不行。

问题就在`addEventListener`身上

抛开vue，看demo

[addEventListener Demo](https://code.juejin.cn/pen/7135578834065653796)



## 总结



HTML **元素重复绑定同一个事件，后者并不会覆盖前面的，只会有绑定的先后顺序**



## 那之前的问题还能解么



在捕获阶段执行事件, 如果不符合条件，则停止事件传递。

```js
el.addEventListener("click", el.captureHandler, true);
```



并且`stopImmediatePropagation`还用不了

stopImmediatePropagation可以阻止元素上绑定的其他事件，但是也是按添加顺序，阻止之后的事件执行
















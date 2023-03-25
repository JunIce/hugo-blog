---
title: "rollup 打包vue2组件"
date: 2023-03-23T15:15:41+08:00
tags: ["rollup-vue2", "rollup"]
categories: ["vue"]
draft: false
---





# rollup 打包vue2组件



rollup打包相对webpack的好处就是可以打包出`es module`, 在使用`vue-cli`创建的项目时，需要打包相关组件作为独立的库，使用rollup打包可以一次打出`cjs`、`es`、`umd`三个类型的包



虽然webpack5中增加了打包module的输出，但是实际在vue-cli建立的项目下，好像还不行



简单记录一下笔记







### 创建一个vue2的项目



> vue create vue-lib



### 添加rollup相关依赖



> yarn add rollup rollup-plugin-commonjs rollup-plugin-vue@5.1.9 -D



```json
"devDependencies": {
    //...
    "rollup": "^3.20.1",
    "rollup-plugin-commonjs": "^10.1.0",
    "rollup-plugin-vue": "5.1.9",
  	// ....
  }
```





`rollup-plugin-vue`这里必须用**5版本**的，最新版本是用来打包vue3代码的，vue2的使用会报错



### 创建rollup配置文件



`rollup.config.mjs`



```js
import commonjs from "rollup-plugin-commonjs";
import VuePlugin from "rollup-plugin-vue";

export default {
  input: {
    app: "./src/index.js",
  },
  output: {
    dir: "./es",
    name: "app",
    format: "es",
  },
  externals: ["vue"],
  plugins: [
    commonjs(),
    VuePlugin(/* VuePluginOptions */),
  ],
};

```





### 创建入口文件



> ./src/index.js



```js
import { foo } from "./utils";
import HelloWorld from "./components/HelloWorld.vue";
import Input from "./components/Input.vue";

export default {
  foo,
  HelloWorld,
  Input,
};
```



这里我们简单写2个组件，并且引入暴露出去



### 建立打包指令



```json
"scripts": {
    // ...
    "rollup": "rollup -c ./rollup.config.mjs"
  },
```



> yarn rollup



打包



![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7503cd04dc0b4345805ed740aa6f1e4b~tplv-k3u1fbpfcp-watermark.image?)

可以看到最后确实是以`es`输出的

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f47bc026f4b441180e6c36969a5c823~tplv-k3u1fbpfcp-watermark.image?)

## issues



#### TypeError: Cannot read properties of undefined (reading 'styles')

查看vue-loader版本

> npm list vue-loader



```bash
➜  vue-lib git:(main) ✗ npm list vue-loader
vue-lib@0.1.0 /Users/volcano/workstation/nodejs/vue-lib
├─┬ @vue/cli-service@5.0.8
│ └── vue-loader@17.0.1
```



可以看到是17版本的，17版本已经是vue3版本的，需要切到vue2版本的`vue-loader`

装个老版本的

> yarn add  vue-loader@14.2.3 -D





## Reference



https://cli.vuejs.org/guide/webpack.html

https://webpack.js.org/configuration/output/#outputmodule

https://rollup-plugin-vue.vuejs.org/options.html

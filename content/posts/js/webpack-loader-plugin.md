---
title: "Webpack Loader Plugin"
date: 2021-10-19T09:00:29+08:00
draft: false
tags: ["js", "webpack"]
---

# webpack Loaders and Plugins different

### Loaders:

Loaders work at the individual file level during or before the bundle is generated.

loader是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中

- 处理一个文件可以使用多个loader，loader的执行顺序和配置中的顺序是相反的，即最后一个loader最先执行，第一个loader最后执行

- 第一个执行的loader接收源文件内容作为参数，其它loader接收前一个执行的loader的返回值作为参数，最后执行的loader会返回此模块的JavaScript源码

```js
module.exports = function(source) {
    // console.log('demo-loader: ', source)
    // 把foo 替换成 Fgg
    return source.replace(/foo/g, 'Fgg')
}
```


### Plugins:

Plugins work at bundle or chunk level and usually work at the end of the bundle generation process. Plugins can also modify how the bundles themselves are created. Plugins have more powerful control than loaders.

在webpack运行的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的API改变输出结果

```js
class BasicPlugin {
    // 在构造函数中获取用户给该插件传入的配置
    constructor(options) {
    }

    // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
    apply(compiler) {
        compiler.hooks.run.tap('Demo Plugin', (compilation) => {
            console.log('webpack 构建正在启动！');
        });
    }
}

// 导出 Plugin
module.exports = BasicPlugin;
```
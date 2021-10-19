---
title: "Webpack Loader Plugin"
date: 2021-10-19T09:00:29+08:00
draft: false
---

# webpack Loaders and Plugins different

### Loaders:

Loaders work at the individual file level during or before the bundle is generated.

```js
module.exports = function(source) {
    // console.log('demo-loader: ', source)
    // 把foo 替换成 Fgg
    return source.replace(/foo/g, 'Fgg')
}
```


### Plugins:

Plugins work at bundle or chunk level and usually work at the end of the bundle generation process. Plugins can also modify how the bundles themselves are created. Plugins have more powerful control than loaders.

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
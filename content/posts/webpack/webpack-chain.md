---
title: "Webpack Chain 源码"
date: 2022-09-05T13:14:25+08:00
tags: ['webpack-chain']
categories: ['webpack']
draft: false
---





# webpack-chain



https://github.com/Yatoo2018/webpack-chain



>  "version": "7.0.0-dev"



`webpack-chain`是用来简化`webpack`配置的工具



## 基础使用



```javascript

const Config = require('webpack-chain')

const config = new Config();

console.log(config.toString());

```



通过`webpack-chain`进行实例化，实例化后的config通过一系列的操作函数进行添加修改配置文件，最终通过`.toString()`方法输出字符串



## 工程目录

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2eeb8538efa6489a8c745a90dd780e9d~tplv-k3u1fbpfcp-watermark.image?)



## 源码分析

## ChainedMap、ChainedSet



`webpack-chain`中2个比较重要的工具，类似js中的`Map`和`Set`，两个类都继承`Chainable`这个类

Chainable内部对自身进行缓存，在end方法中返回了自身



### ChainedMap



`ChainedMap`是一个基础类，后续的接口都是继承于这个类进行封装， 实现了它对应的接口



`ChainedMap`中有一个私有变量

```javascript
this.store = new Map();
```



store变量还是使用的Map实例



#### extend

对实例的方法进行扩展，最终调用的是实例上的`set`方法

```javascript
  extend(methods) {
    this.shorthands = methods;
    methods.forEach((method) => {
      this[method] = (value) => this.set(method, value);
    });
    return this;
  }
```

#### set

在store中存入对应的值

```javascript
set(key, value) {
    this.store.set(key, value);
    return this;
}
```



#### get

获取对应的key的值

```javascript
get(key) {
    return this.store.get(key);
}
```



#### has

判断store中是否含有对应的key

```javascript
has(key) {
    return this.store.has(key);
}
```



#### clear

清空store

```javascript
clear() {
    this.store.clear();
    return this;
}
```



#### delete

删除对应的key

```javascript
delete(key) {
    this.store.delete(key);
    return this;
}
```



#### getOrCompute

和get不同的是，会先判断是否含有对应的key，如果不存在，就会执行第2个参数函数，如果存在，就返回对应的store中对应的key

```javascript
getOrCompute(key, fn) {
    if (!this.has(key)) {
      this.set(key, fn());
    }
    return this.get(key);
}
```



#### when

用来进行条件判断，当条件满足时执行`true` or  `false`

```javascript
  when(
    condition,
    whenTruthy = Function.prototype,
    whenFalsy = Function.prototype,
  ) {
    if (condition) {
      whenTruthy(this);
    } else {
      whenFalsy(this);
    }

    return this;
  }
```



#### merge

把配置对象合并到当前实例的store上，遇到值是对象的同时，递归合并

```javascript
merge(obj, omit = []) {
    Object.keys(obj).forEach((key) => {
      if (omit.includes(key)) {
        return;
      }

      const value = obj[key];

      if (
        (!Array.isArray(value) && typeof value !== 'object') ||
        value === null ||
        !this.has(key)
      ) {
        this.set(key, value);
      } else {
        this.set(key, merge(this.get(key), value));
      }
    });

    return this;
  }

```





#### clean

清楚对象中的空值，最终返回对象中值非null的对象

```javascript
clean(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];

      if (value === undefined) {
        return acc;
      }

      if (Array.isArray(value) && !value.length) {
        return acc;
      }

      if (
        Object.prototype.toString.call(value) === '[object Object]' &&
        !Object.keys(value).length
      ) {
        return acc;
      }

      acc[key] = value;

      return acc;
    }, {});
  }
```



#### order

对当前store进行整理

1. 把当前store转换成为一个对象{}
2. 遍历当前对象，当对象含有`__before`或者`__after`对应的值时，把值插入到对应的位置



最终返回对象和排序后`names`组成的数组



```javascript
order() {
    const entries = [...this.store].reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
    const names = Object.keys(entries);
    const order = [...names];

    names.forEach((name) => {
      if (!entries[name]) {
        return;
      }

      const { __before, __after } = entries[name];

      if (__before && order.includes(__before)) {
        order.splice(order.indexOf(name), 1);
        order.splice(order.indexOf(__before), 0, name);
      } else if (__after && order.includes(__after)) {
        order.splice(order.indexOf(name), 1);
        order.splice(order.indexOf(__after) + 1, 0, name);
      }
    });

    return { entries, order };
  }
```



#### entries/values



基于order方法进行实现，返回`entries`对象和`values`组成的数组



```javascript
entries() {
    const { entries, order } = this.order();

    if (order.length) {
      return entries;
    }

    return undefined;
}

values() {
    const { entries, order } = this.order();

    return order.map((name) => entries[name]);
}
```



### ChainedSet

ChainedSet 在 constructor 函数中实例化了一个store, 实际上就是Set的实例

```javascript
this.store = new Set()
```



#### add/clear/delete/has

分别实现就是Set实例的对应的方法

最后返回this，以实现链式调用



#### prepend/merge

分别是使用Set实例结构后就是数组,

最后返回this，以实现链式调用

```javascript
prepend(value) {
    this.store = new Set([value, ...this.store]);
    return this;
}
```



#### values

返回解构后的store

```javascript
values() {
    return [...this.store];
}
```



#### when

条件判断调用，分别是条件为true或者false的回调函数

最后也会返回this, 实现链式调用

```javascript
when(
    condition,
    whenTruthy = Function.prototype,
    whenFalsy = Function.prototype,
  ) {
    if (condition) {
      whenTruthy(this);
    } else {
      whenFalsy(this);
    }

    return this;
}
```



## Orderable

`orderable`是`webpack-chain`中另一个高阶类函数

通过继承类的形式对类进行扩展，最后返回一个扩展后的类

```javascript
const Orderable = Cls => class extends Cls {
  // ....
}
```



#### before/after

这两个函数分别实现了一个`__before`属性和一个`__after`属性,

最终对于实例的属性进行扩展

```javascript
before(name) {
    if (this.__after) {
      throw new Error(
        `Unable to set .before(${JSON.stringify(
          name,
        )}) with existing value for .after()`,
      );
    }

    this.__before = name;
    return this;
}

after(name) {
    if (this.__before) {
      throw new Error(
        `Unable to set .after(${JSON.stringify(
          name,
        )}) with existing value for .before()`,
      );
    }

    this.__after = name;
    return this;
}
```

这里正好看到在ChainedMap中看到的order方法中的`__before`方法和`__after`方法, 应该就是这里进行扩展的



#### merge

```javascript
merge(obj, omit = []) {
  if (obj.before) {
    this.before(obj.before);
  }

  if (obj.after) {
    this.after(obj.after);
  }

  return super.merge(obj, [...omit, 'before', 'after']);
}
```



## Config

`Config.js`是本项目的入口文件，也就是外部在使用的时候其实就是实例化的这个文件导出的类。



```javascript
const Config = require('webpack-chain');

const config = new Config();
```



默认构造函数在实例化的时候，同时也新建了许多其他实例，像`devServer`、`module`等实例

```javascript
constructor() {
  super();
  this.devServer = new DevServer(this);
  this.entryPoints = new ChainedMap(this);
  this.module = new Module(this);
  this.node = new ChainedMap(this);
  this.optimization = new Optimization(this);
  this.output = new Output(this);
  this.performance = new Performance(this);
  this.plugins = new ChainedMap(this);
  this.resolve = new Resolve(this);
  this.resolveLoader = new ResolveLoader(this);
  this.extend([
    'amd',
    'bail',
    'cache',
    'context',
    'devtool',
    'externals',
    'loader',
    'mode',
    'name',
    'parallelism',
    'profile',
    'recordsInputPath',
    'recordsPath',
    'recordsOutputPath',
    'stats',
    'target',
    'watch',
    'watchOptions',
  ]);
}
```



在构造函数中同时使用extend方法，扩展实例上的方法

```javascript
this[method] = value => this.set(method, value);
```

这样我们就可以在实例上直接用`[实例].`的形式直接调用



`Config`上还有一个`plugin`方法

```javascript
plugin(name) {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name));
}
```



`plugin`通过注册一个`name`，对应一个回调函数，回调函数返回一个Plugin实例

`getOrCompute`方法用于确定`this.plugins`中对于同一个`name`，有且只有一个Plugin实例

```javascript
config
  .plugin('clean')
    .use(CleanPlugin, [['dist'], { root: '/dir' }]);
```



`entry`方法用于注册入口文件，webpack首先上是支持多入口的，所以这里也通过`getOrCompute`方法，对于同一个入口，返回一个实例

```javascript
config
  .entry('index')
    .add('src/index.js')
    .end()
  .entry('index2')
    .add('src/index2.js')
    .end()
```



`toString`方法用于返回最后实例化后的配置对象，实际上调用的是`toConfig`方法

```javascript
toConfig() {
  const entryPoints = this.entryPoints.entries() || {};

  return this.clean(
    Object.assign(this.entries() || {}, {
      node: this.node.entries(),
      output: this.output.entries(),
      resolve: this.resolve.toConfig(),
      resolveLoader: this.resolveLoader.toConfig(),
      devServer: this.devServer.toConfig(),
      module: this.module.toConfig(),
      optimization: this.optimization.toConfig(),
      plugins: this.plugins.values().map((plugin) => plugin.toConfig()),
      performance: this.performance.entries(),
      entry: Object.keys(entryPoints).reduce(
        (acc, key) =>
          Object.assign(acc, { [key]: entryPoints[key].values() }),
        {},
      ),
    }),
  );
}
```

返回一个去除了对象空值的配置后的对象



## Module

Module对应于`webpack.config.js`中的`module`对象



`webpack.config.js`

```javascript
module.exports = {
  module: {
    // ...
  }
}
```



`Module`中通过2个方法`defaultRule`和`rule`定义module中的具名规则`rule`

```javascript
defaultRule(name) {
  return this.defaultRules.getOrCompute(
    name,
    () => new Rule(this, name, 'defaultRule'),
  );
}

rule(name) {
  return this.rules.getOrCompute(name, () => new Rule(this, name, 'rule'));
}
```



具名的rule进行定义

```javascript
config.module
  .rule('lint')
    .test(/\.js$/)
  .rule('compile')
    .test(/\.js$/)
```


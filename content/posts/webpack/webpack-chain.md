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


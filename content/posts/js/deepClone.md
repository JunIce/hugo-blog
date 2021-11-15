---
title: "DeepClone"
date: 2021-11-15T09:38:30+08:00
draft: true
---

### 深拷贝源码代码

- 获取对象的类型

```js
function getObjectType(obj) {
    const toString = Object.prototype.toString;

    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    }

    if (obj instanceof Element) {
        return 'element'
    }

    return map[toString.call(obj)]
}
```

- 深拷贝

```js

function deepClone(data) {
    const type = getObjectType(data)

    let obj;

    if(type === 'array') {
        obj = [];
    } else if (type === 'object') {
        obj = {};
    } else {
        return data;
    }


    if (type === 'array') {
        for (var i = 0, len = data.length; i < len; i++) {
            obj.push(deepClone(data[i]))
        }
    } else if (type === 'object') {
        for (var key in data) {
            obj[key] = deepClone(data[key])
        }
    }
    return obj

}
```



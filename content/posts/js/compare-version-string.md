---
title: "对比2个版本号的方法"
date: 2023-04-19T16:20:55+08:00
draft: false
tags: ["semver", "版本号"]
categories: [ "js"]
---



# 对比2个版本号的方法



## semver



使用第三方库`semver`



```js
$ npm install semver

var semver = require('semver');
semver.diff('3.4.5', '4.3.7') //'major'
semver.diff('3.4.5', '3.3.7') //'minor'
semver.gte('3.4.8', '3.4.7') //true
semver.ltr('3.4.8', '3.4.7') //false

semver.valid('1.2.3') // '1.2.3'
semver.valid('a.b.c') // null
semver.clean(' =v1.2.3 ') // '1.2.3'
semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3') // true
semver.gt('1.2.3', '9.8.7') // false
semver.lt('1.2.3', '9.8.7') // true

var versions = [ '1.2.3', '3.4.5', '1.0.2' ]
var max = versions.sort(semver.rcompare)[0]
var min = versions.sort(semver.compare)[0]
var max = semver.maxSatisfying(versions, '*')
```


## localeCompare

The simplest is to use `localeCompare` :

```js
a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
```

This will return:

- ` 0`: version strings are equal
- ` 1`: version `a` is greater than `b`
- `-1`: version `b` is greater than `a`





## javascript function



**compare**

```js
// Return 1 if a > b
// Return -1 if a < b
// Return 0 if a == b
function compare(a, b) {
    if (a === b) {
       return 0;
    }

    var a_components = a.split(".");
    var b_components = b.split(".");

    var len = Math.min(a_components.length, b_components.length);

    // loop while the components are equal
    for (var i = 0; i < len; i++) {
        // A bigger than B
        if (parseInt(a_components[i]) > parseInt(b_components[i])) {
            return 1;
        }

        // B bigger than A
        if (parseInt(a_components[i]) < parseInt(b_components[i])) {
            return -1;
        }
    }

    // If one's a prefix of the other, the longer one is greater.
    if (a_components.length > b_components.length) {
        return 1;
    }

    if (a_components.length < b_components.length) {
        return -1;
    }

    // Otherwise they are the same.
    return 0;
}

```


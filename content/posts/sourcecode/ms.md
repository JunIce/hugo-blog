---
title: "ms源码解析"
date: 2022-10-09T08:46:48+08:00
tags: ["源码", "ms"]
categories: ["源码"]
draft: false
---



# ms源码



ms是一个用于毫秒时间格式化的工具，可以在语义化的时间格式和毫秒之间进行转换。

#### 源码地址

[vercel/ms: Tiny millisecond conversion utility (github.com)](https://github.com/vercel/ms)



## Usage



语义化时间转毫秒

```javascript
ms('2 days')  // 172800000
ms('1d')      // 86400000
ms('10h')     // 36000000
```



毫秒转语义化时间

```javascript
ms(60000)             // "1m"
ms(2 * 60000)         // "2m"
// longFormat
ms(60000, { long: true })             // "1 minute"
ms(2 * 60000, { long: true })         // "2 minutes"
```





## 源码



入口函数传入2个参数，第1个就是需要转换的值，第2个是配置参数

```javascript
function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};
```



- 如果第1个参数是`string`， 走`parse`方法
- 如果是`number`, 走`format`方法



### parse



parse中通过正则表达式把传入的语义化的参数进行分割

```javascript
var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
```



目的就是把语义化的字符串中的数字和单位进行分割



**正则表达式进行图形化分析**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24c672a263234e7c92859954ea7221b7~tplv-k3u1fbpfcp-watermark.image?)



最后把拿到的**数值**和 **单位对应的毫秒**进行**相乘**



```javascript
var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
```



这里还要注意一下

一个地球年其实是`365.25`天， 好吧，之前都没有注意过这个问题



### fmtShort

对于的输入毫秒数， 输入语义化的字符串



```javascript
ms(60000)             // "1m"
ms(2 * 60000)         // "2m"
```



```javascript
function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}
```

- 对传入的值进行取绝对值
- 取值后和单位毫秒数进行比对，如果大于某个单位，就会取输入值和单位毫秒数的商，最后进行四舍五入



### fmtLong

对于的输入毫秒数， 输入语义化的字符串，只不过最后的单位会是完整的字符串，如果是大于1的，单位自动增加复数

```javascript
ms(60000, { long: true })             // "1 minute"
ms(2 * 60000, { long: true })         // "2 minutes"
```



```javascript
function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}
```



`plural`中 `msAbs >= n * 1.5` 

这里的n 要乘以 **1.5**, 是为了处理`Math.round`的四舍五入的后的值

比如ms的值是1.2个n， 四舍五入后就是1， 自然单位就不用以复数的形式输出， 加**s**了
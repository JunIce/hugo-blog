---
title: "Lodash ToNumber"
date: 2021-11-08T15:28:20+08:00
draft: false
---

## toNumber

`lodash`中转数字函数

```js

function isObject(value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

function isSymbol(value) {
  const type = typeof value
  return type == 'symbol' || (type === 'object' && value != null && getTag(value) == '[object Symbol]')
}

/** Used as references for various `Number` constants. */
const NAN = 0 / 0

/** Used to match leading and trailing whitespace. */
const reTrim = /^\s+|\s+$/g

/** Used to detect bad signed hexadecimal string values. */
// 是否是十六进制数据
const reIsBadHex = /^[-+]0x[0-9a-f]+$/i

/** Used to detect binary string values. */
const reIsBinary = /^0b[01]+$/i

/** Used to detect octal string values. */
const reIsOctal = /^0o[0-7]+$/i

/** Built-in method references without a dependency on `root`. */
const freeParseInt = parseInt

function toNumber(value) {
  // 类型是Number
  if (typeof value === 'number') {
    return value
  }
  // 类型是symbol
  if (isSymbol(value)) {
    return NAN
  }
  // 如果是对象，取出对象的值或者转成字符串
  if (isObject(value)) {
    const other = typeof value.valueOf === 'function' ? value.valueOf() : value
    value = isObject(other) ? `${other}` : other
  }
  // 不是字符串的情况
  if (typeof value !== 'string') {
    return value === 0 ? value : +value
  }
  // 去除两边空格
  value = value.replace(reTrim, '')
  // 是否是二进制数据
  const isBinary = reIsBinary.test(value)
  // 是否是八进制数据
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value)
}

```



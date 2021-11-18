---
title: "Lodash ToNumber"
date: 2021-11-08T15:28:20+08:00
draft: false
tags: ["js"]
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

`parseInt`函数解析

- 第一个参数，string
- 第二个参数， 2～36 表示解析数据的基数

> parseInt函数将其第一个参数转换为一个字符串，对该字符串进行解析，然后返回一个整数或 NaN。
> 如果不是NaN，返回值将是以第一个参数作为指定基数 radix 的转换后的十进制整数。(例如，radix为10，就是可以转换十进制数，为8可以转换八进制数"07"，16可以转换十六进制数"0xff"，以此类推)。
> 对于 radix 为10以上的，英文字母表示大于9的数字。例如，对于十六进制数（基数16），则使用 A 到 F 。
> 如果 parseInt 遇到的字符不是指定 radix 参数中的数字，它将忽略该字符以及所有后续字符，并返回到该点为止已解析的整数值。 parseInt 将数字截断为整数值。 允许前导和尾随空格。




---
title: "jest -- Matcher匹配器"
date: 2022-02-21T09:28:32+08:00
draft: true
tags: ["jest"]
---

# jest V27.5

## Common Matchers 匹配器

测试就是测试单元的返回是否匹配某个期望的值或者格式，所以匹配器是每个 case 出现频率最高的

### 常规匹配器`toBe`、`toEqual`

其中`toEqual`是完全相等，就是它的字面意思相等，必须子元素也相等

```js
expect(1 + 3).toBe(4);
expect(1 + 3).toEqual(4);
```

### Truthiness 是否是真值

用于区分是否是`undefined`、`null` 或 `false`

`toBeNull` 匹配 null
`toBeUndefined` 匹配 undefined
`toBeDefined` 匹配非 undefined
`toBeTruthy` 匹配 true
`toBeFalsy` 匹配 false

```js
test("null", () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});
```

### Number 数字

`toBeGreaterThan` 大于
`toBeGreaterThanOrEqual` 大于或等于
`toBeLessThan` 小于
`toBeLessThanOrEqual` 小于或等于

```js
const value = 2 + 2;
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3.5);
expect(value).toBeLessThan(5);
expect(value).toBeLessThanOrEqual(4.5);
```

浮点数使用`toBeCloseTo`, 去解决精度错误

```js
const a = 0.1 + 0.2;
expect(a).toBeCloseTo(0.3); // true
```

### Strings 字符串

`toMatch` 使用正则表达式去匹配

```js
expect("Christoph").toMatch(/stop/);
```

### Arrays and iterables 数组或可遍历对象

`toCotain` 是否包含

```js
const shoppingList = [
  "diapers",
  "kleenex",
  "trash bags",
  "paper towels",
  "milk",
];

expect(shoppingList).toContain("milk");
```

### Exceptions 异常

`toThrow` 接受错误

```js
function genError() {
  throw new Error("error");
}

expect(() => genError()).toThrow();
expect(() => genError()).toThrow(Error);
```

### callbacks 回调

回调函数中我们需要测试 在回调函数中接受的值，所以就不能单纯的在回调函数使用`expect`匹配了

需要配合`test`函数的参数`done`, `done`是一个函数，jest 会等待 done 被调用后才会结束当前测试

```js
test("some test text", (done) => {
  function cb() {
    try {
      expect("").toBe("");
      done();
    } catch (err) {
      done(error);
    }
  }

  cb();
});
```

### Promises

如果测试的异步函数是一个`Promise`, 就必须在`test`函数中返回`promise`

```js
test("", () => {

    return new Promise(() => {
        // ....
        // your logic
        expect() ....
    })
})
```

如果需要测试异常, 配合`expect.assertions`使用，检查异常调用次数，如果没有调用，则测试失败

```js
test("the fetch fails with an error", () => {
  expect.assertions(1);
  return fetchData().catch((e) => expect(e).toMatch("error"));
});
```

也可以配合内部`.resolves / .rejects`使用

```js
test("the data is peanut butter", () => {
  return expect(fetchData()).resolves.toBe("peanut butter");
});

test("the fetch fails with an error", () => {
  return expect(fetchData()).rejects.toMatch("error");
});
```

### Async/Await

检查then方法直接在test回调函数中使用async语法

```js
test('the data is peanut butter', async () => {
  const data = await fetchData();
  expect(data).toBe('peanut butter');
});
```

异常则配合`expect.assertions`使用

```js
test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await fetchData();
  } catch (e) {
    expect(e).toMatch('error');
  }
});
```

当然同理可以内置函数捕获`.resolves`或`.rejects`




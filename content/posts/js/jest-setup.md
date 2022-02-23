---
title: "jest -- 设置setup && 卸载teardown"
date: 2022-02-22T09:04:55+08:00
draft: true
---


### beforeEach
### afterEach

在每一个测试之前/之后需要执行的脚本， 当脚本是一个异步函数的时候，需要通过`done`参数或者返回一个`promise`

异步示例

```js
afterEach((done) => {

  const clearCityDatabase = () => {
      try{
          // ....
          done()
      }
  }

  clearCityDatabase();
});

// or

afterEach((done) => {
  return clearCityDatabase(); // clearCityDatabase is promise
});

```

### beforeAll 
### afterAll

在所有的测试过程中只会执行一次的脚本


### Scoping 范围


通过`describe`去包裹一个代码范围， `describe` 中也会有相应的生命周期

```js
describe("", () => {

    beforeEach(() => {
        //
    })

    test("", () => {
        //
    })
})
```

### Order of execution of describe and test blocks

`describe` 和对应test case的执行顺序

1. describe内代码由上往下执行， 同步执行
2. 遇到内部describe, 执行内部非test代码， 同步执行， 其中test case进入异步调用栈
3. 遇到内部test函数， 同样推入到异步调用栈
4. 清空test case异步调用栈， 先进先出

```js
describe('outer', () => {
  console.log('describe outer-a');

  describe('describe inner 1', () => {
    console.log('describe inner 1');
    test('test 1', () => {
      console.log('test for describe inner 1');
      expect(true).toEqual(true);
    });
  });

  console.log('describe outer-b');

  test('test 1', () => {
    console.log('test for describe outer');
    expect(true).toEqual(true);
  });

  describe('describe inner 2', () => {
    console.log('describe inner 2');
    test('test for describe inner 2', () => {
      console.log('test for describe inner 2');
      expect(false).toEqual(false);
    });
  });

  console.log('describe outer-c');
});

// describe outer-a
// describe inner 1
// describe outer-b
// describe inner 2
// describe outer-c
// test for describe inner 1
// test for describe outer
// test for describe inner 2
```


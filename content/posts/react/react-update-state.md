---
title: "React 更新 State 的方式"
date: 2022-02-18T11:00:36+08:00
draft: true
categories: ["React"]
---

## React 更新

- 1. 直接赋值

```js
const [count, setCount] = useState(0)

// update
setCount(0 + 1)
```

- 2. 赋值函数

```js
setCount(count => count + 1)
```

## 异步回调中获取不到最新值的问题

官方文档中标明

> 组件内部的任何函数，包括事件处理函数和 Effect，都是从它被创建的那次渲染中被「看到」的，所以引用的值任然是旧的，最后导致 setState 出现异常


```js
import React, { useState, useEffect } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);
  }, [count]);

  const handleClick = () => {
    Promise.resolve().then(() => {
      setCount(count+1); // 此时赋值前 count 为：1
    })
      .then(() => {
        setCount(count+1); // 此时赋值前 count 为旧状态仍然为：1
      });
  }

  return (
    <>
      <button onClick={handleClick}>change</button>
    </>
  );
}

export default App;
```


### 方案1： 使用更新函数

```js
Promise.resolve().then(() => {
      setCount(count => count+1); // 此时赋值前 count 为：1
    })
      .then(() => {
        setCount(count => count+1); // 此时赋值前 count 为旧状态仍然为：2
      });
```

### 方案2： 强制更新 useReducer

```js
import React, { useState, useReducer, useEffect } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  // 必要的地方需要强制刷新
  //....forceUpdate()

  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleClick}>change</button>
    </>
  );
}

export default App;

```

### 方案3: 使用ref保存之前的值

```js
import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  let ref = useRef();
  useEffect(() => {
    ref.current = count;
    console.log(count);
  });

  const handleClick = () => {
    Promise.resolve().then(() => {
      const now = ref.current + 1;
      ref.current = now;
      setCount(now);
    })
      .then(() => {
        setCount(ref.current + 1);
      });
  }

  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleClick}>change</button>
    </>
  );
}

export default App;

```
---
title: "React Ref and CreateRef"
date: 2022-05-14T11:28:43+08:00
tags: ["react"]
categories: ["react"]
draft: false
---





# useRef vs createRef



- 组件每次渲染都会执行`createRef`生成一个ref对象
- `useRef`在第一次渲染后创建一个ref对象, 重新渲染后如果发现已经创建就不会再执行了



```tsx
import React, { useRef, createRef, useState } from "react";
import ReactDOM from "react-dom";

function App() {
  const [renderIndex, setRenderIndex] = useState(1);
  const refFromUseRef = useRef();
  const refFromCreateRef = createRef();
  if (!refFromUseRef.current) {
    refFromUseRef.current = renderIndex;
  }
  if (!refFromCreateRef.current) {
    refFromCreateRef.current = renderIndex;
  }
  return (
    <div className="App">
      Current render index: {renderIndex}
      <br />
      First render index remembered within refFromUseRef.current:
      {refFromUseRef.current}
      <br />
      First render index unsuccessfully remembered within
      refFromCreateRef.current:
      {refFromCreateRef.current}
      <br />
      <button onClick={() => setRenderIndex(prev => prev + 1)}>
        Cause re-render
      </button>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```





### 


---
title: "React hooks UseLayoutEffect使用"
date: 2022-03-02T17:21:14+08:00
draft: true
tags: ["react", "hooks"]
categories: ["react"]
---

## useLayoutEffect

使用方法类似 `useEffect`, 不同的是它会在dom更新后被调用。通常使用在需要计算更新后的dom的尺寸计算等。

Dom变化后同步触发。使用它去读取dom布局

> The signature is identical to useEffect, but it fires synchronously after all DOM mutations. Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside useLayoutEffect will be flushed synchronously, before the browser has a chance to paint.


### DEMO

```jsx
const Message = ({boxRef, children}) => {
  const msgRef = React.useRef(null);
  React.useLayoutEffect(() => {
    const rect = boxRef.current.getBoundingClientRect();
    msgRef.current.style.top = `${rect.height + rect.top}px`;
  }, []);

  return <span ref={msgRef} className="msg">{children}</span>;
};

const App = () => {
  const [show, setShow] = React.useState(false);
  const boxRef = React.useRef(null);

  return (
    <div>
      <div ref={boxRef} className="box" onClick={() => setShow(prev => !prev)}>Click me</div>
      {show && <Message boxRef={boxRef}>Foo bar baz</Message>}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
```

```css
.box {
  position: absolute;
  width: 100px;
  height: 100px;
  background: green;
  color: white;
}

.msg {
  position: relative;
  border: 1px solid red;
}
```

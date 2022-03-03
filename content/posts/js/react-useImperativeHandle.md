---
title: "React hooks UseImperativeHandle 使用"
date: 2022-03-02T17:07:39+08:00
draft: true
tags: ["react", "hooks"]
categories: ["React"]
---

## useImperativeHandle

子组件使用 useImperativeHandle 对父组件暴露对应的 api， 需要配合 `forwardRef` 一起使用

> useImperativeHandle(ref, createHandle, [deps])

- ref： 需要被赋值的 ref 对象。
- createHandle：createHandle 函数的返回值作为 ref.current 的值。
- [deps] ： 依赖数组，依赖发生变化会重新执行 createHandle 函数。 当依赖是`[{}]`时, 组件每次重新渲染都会更新到最新

```jsx
const MyInput = React.forwardRef((props, ref) => {
  const [val, setVal] = React.useState("");
  const inputRef = React.useRef();

  React.useImperativeHandle(ref, () => ({
    blur: () => {
      document.title = val;
      inputRef.current.blur();
    },
  }));

  return (
    <input
      ref={inputRef}
      val={val}
      onChange={(e) => setVal(e.target.value)}
      {...props}
    />
  );
});

const App = () => {
  const ref = React.useRef(null);
  const onBlur = () => {
    console.log(ref.current); // Only contains one property!
    ref.current.blur();
  };

  return <MyInput ref={ref} onBlur={onBlur} />;
};

ReactDOM.render(<App />, document.getElementById("app"));
```

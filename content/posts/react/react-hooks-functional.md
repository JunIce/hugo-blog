---
title: "React 函数式组件使用手册"
date: 2022-05-14T20:44:34+08:00
tags: ["react"]
categories: ["react"]
draft: false
---





## React Hooks Functional对应class Component生命周期写法



### componentDidMount



```ts
useEffect(() => {
  // Your code here
}, []);
```





### componentDidUpdate



```js
useEffect(() => {
  // Your code here
}, [yourDependency]);
```



### componentWillUnmount



```js
useEffect(() => {
  // componentWillUnmount
  return () => {
     // Your code here
  }
}, [yourDependency]);
```





## `Ref.current`作为`useEffect`的依赖





> Mutable values like 'ref.current' aren't valid dependencies because mutating them doesn't re-render the component. 





因为引用不会触发渲染，因此不会触发`useEffect`渲染



```typescript
const Foo = () => {
  const [, render] = useReducer(p => !p, false);
  const ref = useRef(0);

  const onClickRender = () => {
    ref.current += 1;
    render();
  };

  const onClickNoRender = () => {
    ref.current += 1;
  };

  useEffect(() => {
    console.log('ref changed');
  }, [ref.current]);

  return (
    <>
      <button onClick={onClickRender}>Render</button>
      <button onClick={onClickNoRender}>No Render</button>
    </>
  );
};
```



**正确获取组件ref实例**



```js
const Component = () => {
  const [isMounted, toggle] = useReducer((p) => !p, true);
  const [elementRect, setElementRect] = useState();

  const handleRect = useCallback((node) => {
    setElementRect(node?.getBoundingClientRect());
  }, []);

  return (
    <>
      {isMounted && <div ref={handleRect}>Example</div>}
      <button onClick={toggle}>Toggle</button>
      <pre>{JSON.stringify(elementRect, null, 2)}</pre>
    </>
  );
};
```
---
title: "React ForwardRef用法"
date: 2022-05-28T09:32:48+08:00
tags: ["react"]
categories: ["react"]
draft: falseforwardRef
---



# ForwardRef



# forwardRef





## ref



1. Ref挂载到DOM元素上时，就是对DOM元素本身的使用
2. Ref挂载到Class组件的时候，就是class组件实例的引用，可以调用实例本身的属性和方法
3. Ref不能作用到函数式组件上，函数式组件没有实例，所以就要使用这个forwardRef包裹一下函数式组件



## ForwardRef

`ForwardRef`在`react`中用作ref转发

`fowardRef`传入一个函数，返回值是一个react组件



> React.forwardRef()



其中第二个参数就是ref, 可以透传到任意dom元素上

```tsx
const Demo = React.forwardRef<HTMLDivElement, {}>((props, ref) => {

	return (
    <div {...restProps}>
      <div ref={ref} className={cls} style={style}>
        //...
      </div>
    </div>
  );
})
```



## useImperativeHandle

函数式组件中配合`useImperativeHandle`一起使用



当你函数式组件需要暴露给外部组件一个对象时，需要使用`useImperativeHandle`勾子函数进行暴露



```jsx
const Child = forwardRef((props, ref) => {
  const [color, setColor] = useState("red");
  // To customize the value that the parent will get in their ref.current: 
  // pass the ref object to useImperativeHandle as the first argument. 
  // Then, whatever will be returned from the callback in the second argument, 
  // will be the value of ref.current. 
  // Here I return an object with the toggleColor method on it, for the parent to use:
  useImperativeHandle(ref, () => ({
    toggleColor: () => setColor(prevColor => prevColor === "red" ? "blue" : "red")
  }));
  return <div style={{backgroundColor: color}}>yo</div>;
});


class Parent extends Component {
  childRef = createRef();
  handleButtonClicked = () => {
    // Ref passed to a function component wrapped in forwardRef.
    // Note that nothing has changed for this Parent component
    // compared with the class component in example 2!
    this.childRef.current.toggleColor();
  }
  render() {
    return (
      <div>
        <button onClick={this.handleButtonClicked}>toggle color!</button>
        <Child ref={childRef} />
      </div>
    );
  }
}
```


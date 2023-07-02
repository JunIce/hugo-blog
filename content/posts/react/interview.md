---
title: "react 基础知识"
date: 2023-07-01T16:31:19+08:00
draft: true
tags: ["react"]
categories: ["react"]
---









### react主要特点

- jsx语法，可以在js中写html
- 虚拟dom
- 可以服务端渲染ssr
- 单一数据流 数据绑定
- 可复用式组件



### 元素和组件区别 Element & Component

- 元素是一个普通对象标识dom节点
- 元素可以在属性中包含其他元素

- 组件是一个带render方法的类或者定义成一个函数，最后返回`jsx tree`



### React创建组件

- 函数式组件
- class组件



### 什么时候使用Class组件或者函数组件

- 需要使用到生命周期方法时，但函数式组件中不存在对应的方法
- 错误边界

```jsx
import { ErrorBoundary } from "react-error-boundary";

<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <ExampleApplication />
</ErrorBoundary>
```



### Pure Component

同样的state返回同样的component

可以通过使用`React.memo`方法包裹组件，使用浅对比比对props，有助于性能优化



### `state` in React

state是一个对象，可能在生命周期中更改，组件会进行重新渲染

建议状态尽可能简单、减少有状态组件的数量



### `props`  in React

- 传递数据给子组件
- 出发状态



### props vs state

**state**

- 维护自身状态
- 修改后自身和子组件会重新渲染



**props**

- 从父组件传递进来
- 不可以修改



### setState

- 直接赋值state组件不会更新，需要通过setState更新state

setState第二个参数是回调函数，由于setState是异步函数，所以在post之后会触发



### 事件处理

- 事件名是camelCase
- 不能通过返回false组织默认行为处罚，必须要调用`event.preventDefault`



### key

帮助React识别哪些组件发生了变化，如果使用索引作为key，可能会导致组件状态问题



### ref

用于访问dom元素或者组件实例



### 创建ref

- 使用`createRef`
- 通过元素ref的回调函数

```jsx
render() {
    return (
      <input
        value={this.state.term}
        onChange={this.onInputChange.bind(this)}
        ref={(r) => {
            // ....r is ref instance
        }}
      />
    );
  }
```



### forward refs

`React.forwardRef`可以把组件的ref引用传递下去



```jsx
React.forwardRef((props, ref) => {
    return (
    	// ref
        <input ref={ref} />
    )
})
```



### findDOMNode

React中同时可以使用`findDOMNode`查找到指定的dom元素实例

```jsx
findDOMNode(this).scrollIntoView();
```



### Ref String

`ref={'input'}` 这种形式已经在v16版本中移除了



**弊端**

- 迫使react跟踪当前正在执行的组件
- 不能进行组合
- 不能进行推导












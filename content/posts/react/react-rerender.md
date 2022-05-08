---
title: "React Rerender重绘"
date: 2022-05-08T20:13:40+08:00
tags:
categories: ["react"]
draft: false
---





# react rerender



react中组件重绘是一个不可避免的问题，因为react中组件的更新方式就是旧组件销毁，新组件替代旧组件的形式。而且react组件中以树的形式进行构建，必然带来的就是父组件更新，其所有的子组件都会更新





```tsx
// 父组件
function ListComp() {
  const [list, setList] = useState([
    {
      id: 1,
      value: "",
    },
    {
      id: 2,
      value: "",
    },
    {
      id: 3,
      value: "",
    },
  ]);

  return (
    <div>
      <div>{JSON.stringify(list)}</div>

      <div>
        {list.map((item, idx) => (
          <Item
            key={idx}
            {...item}
            onChange={(id: number, value: any) => {
              setList(
                list.map((item) => {
                  if (item.id === id) {
                    item.value = value;
                  }
                  return item;
                })
              );
            }}
          ></Item>
        ))}
      </div>
    </div>
  );
}

// 子组件
function Item({ id, value, onChange }) {
  return (
    <div>
      <h3>{id}</h3>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
      />
    </div>
  );
}
```





在只输入一个输入框的同时，其他子组件都在重新渲染

<video src="./react-rerender.assets/initial.mp4"></video





同样只更新父组件的同时，子组件也会更新



<video src="./react-rerender.assets/simple.mp4"></video>



**当组件的状态发生变化时，组件及其子组件都会rerender**





如果不想子组件发生不必要的render，使用`memo`包裹一下组件



```jsx
const Item = memo(() => <div>Item</div>)
```



<video src="./react-rerender.assets/simple-memo.mp4"></video>



可以看到父组件更新后，子组件不会再发生`rerender`了





我重新包裹一下我们的子组件`Item`

```jsx
const ItemWrapper = memo(Item)
```



子组件还是会发生不必要的`rerender`



当组件使用memo包裹后还会发生`rerender`，说明组件又`props`发生了变化



排查后就是`onChange`属性发生了变化， 每次父组件rerender后子组件都会重新生产一个`onChange`事件

```jsx
onChange={(id: number, value: any) => {
  setList(
    list.map((item) => {
      if (item.id === id) {
        item.value = value;
      }
      return item;
    })
  );
}}
```



使用`useCallback`对属性进行缓存，`useCallback`会生成一个函数缓存



```tsx
  const onChange = useCallback((id: any, value: any) => {
    setList((preList) =>
      preList.map((item) => {
        if (item.id === id) {
          item.value = value;
        }
        return item;
      })
    );
  }, []);
```



<video src="./react-rerender.assets/fixed.mp4"></video>

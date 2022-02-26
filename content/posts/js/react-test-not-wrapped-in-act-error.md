---
title: "React组件测试问题方案 -- not wrapped in act"
date: 2022-02-26T11:57:01+08:00
draft: true
---

## 在使用`@testing-library/react`进行react测试的时候可能会出现错误

这是由于我们尝试在组件内部更改组件的状态导致组件重新渲染，但是不改变我测试个啥呢是吧

```js
When testing, code that causes React state updates should be wrapped into act(...):

act(() => {  
/* fire events that update state */ 
}); 
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://fb.me/react-wrap-tests-with-act
```

官方文档推荐我们把组件的渲染或者组件触发的事件都放到`act`中去做

```tsx
it("should render and update a counter", () => {
  // Render a component
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  ...  

  // Fire event to trigger component update
  act(() => 
    button.dispatchEvent(new MouseEvent('click', {bubbles: true})); 
  });
  ...
});
```

其实`@testing-library/react`已经继承了这些API，所以可以直接在测试代码里书写

出现以上错误的可能是以下原因

### 1.组件内部有异步渲染

待测试组件

```tsx
const TestComponent = () => {
  const [person, setPerson] = React.useState();
  const handleFetch = React.useCallback(async () => {
    const { data } = await fetchData();
    setPerson(data.person); // 异步更新
  }, []);
  return (
    <button type="button" onClick="handleFetch">
      {person ? person.name : "Fetch"}
    </button>
  );
};
```

测试代码

```tsx
it("should fetch person name", async () => {
  const { getByText } = render(<MyComponent />);
  fireEvent.click(getByText("Fetch"));
  // expect(getByText("David")).toBeInTheDocument(); // 直接使用就会报错，提示我们需要放到act中去做操作
   
  // 放到waitFor中
   await waitFor(() => {
        expect(getByText("David")).toBeInTheDocument();
   })
});
```

### 2. 组件中有使用`setInterval` 或者`setTimeout`

```tsx
const TestComponent = () => {
  const [person, setPerson] = React.useState("button");
  const handleFetch = React.Effect(async () => {
    setTimeout(() => setPerson("new button"), 1000)
  }, []);
  return (
    <button type="button" onClick="handleFetch">
      {person}
    </button>
  );
};
```

测试代码

```tsx
it("should display Toast in 1 sec", () => {
  jest.useFakeTimers();
  const { queryByText } = render(<MyComponent />);
  //  jest.advanceTimersByTime(1000);// 错误代码
  act(() => {
    jest.advanceTimersByTime(1000)
  })
  expect(queryByText("Toast!")).not.toBeInTheDocument();
});2
```

### 3. 测试代码在组件渲染之前提前结束了

```tsx
const TestComponent = () => {
  const { loading, data } = useQuery(QUERY_ACCOUNTS);
  return loading ? (
    <div>Loading ...</div>
  ) : (
    <div>{data.accounts.length}</div>
  );
};
```

现在需要测试`loading` 和 `loading`之后的状态

测试代码

```tsx
it("should display loading state", async() => {
  const { getByText } = render(
    <MockedApolloProvider mocks={accountMock}>
      <MyComponent />
    </MockedApolloProvider>
  );
  expect(getByText("Loading ...")).toBeInTheDocument();
   // 到这里我们只能测试到loading状态
  
  // 在waitForElementToBeRemoved 这个api中测试到loading之后的状态
  await waitForElementToBeRemoved(() => queryByText("Loading ...").not.toBeInTheDocument()); 
});
```

### 4. 用户事件触发的更新

```tsx
it("should validate phone numbers", () => {
  ...
  fireEvent.change(getByPlaceholder("Phone"), {
    target: { value: "123456789" }
  });
  fireEvent.click(getByText("Save"));
  expect(getByText(
    "Please enter a valid phone number"
  )).toBeInTheDocument();
});
```

直接在代码里预测改变值时会报错

```tsx
it("should validate phone numbers", () => {
  ...
  fireEvent.change(getByPlaceholder("Phone"), {
    target: { value: "123456789" }
  });
  fireEvent.click(getByText("Save"));
  
  // waitFor 中进行更新后测试
  await waitFor(() => {
    expect(getByText(
      "Please enter a valid phone number"
    )).toBeInTheDocument();
  })
});
```
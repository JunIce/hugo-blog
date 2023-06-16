---
title: "react 受控组件和非受控组件"
date: 2023-06-11T16:31:19+08:00
draft: true
tags: ["受控组件和非受控组件"]
categories: ["react"]
---

# react 受控组件和非受控组件



## 受控组件



受控组件就是组件的状态收到父组件的控制，本身不保存状态，所有的状态从组件传入进来

方法也是从父组件传入进来

```tsx
const ControlledInput = ({ value, onChange }) => (
  <input value={value} onChange={(e) => onChange(e.target.value)} />
);

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form>
      <ControlledInput value={email} onChange={setEmail} placeholder="Email" />
      <ControlledInput
        value={password}
        onChange={setPassword}
        placeholder="Password"
      />
      <button>Submit</button>
    </form>
  );
};
```





## 非受控组件



非受控组件，组件自身保存状态， 通过change方法通知父组件更改父组件的值



```tsx
const UncontrolledInput = ({ defaultValue, placeholder }) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
    />
  );
};

const LoginForm = () => {
  return (
    <form>
      <UncontrolledInput defaultValue="" placeholder="Email" />
      <UncontrolledInput defaultValue="" placeholder="Password" />
      <button>Submit</button>
    </form>
  );
};
```







## 特点

| Features         | 受控组件                                           | 非受控组件                                               |
| ---------------- | -------------------------------------------------- | -------------------------------------------------------- |
| Value Management | Managed by React state                             | Managed by component's own internal state                |
| User Interaction | Parent component updates state on user interaction | Component updates own internal state on user interaction |
| Data Flow        | Data flows from parent component to component      | Data flows within the component                          |
| Debugging        | Easier to debug                                    | More difficult to debug                                  |
| Performance      | Generally faster as there's less state management  | Generally slower as there's more state management        |
| Code Complexity  | Less complex code                                  | More complex code                                        |
| Best Practices   | Considered a best practice                         | Considered an alternate approach                         |





### Reference

https://blog.logrocket.com/controlled-vs-uncontrolled-components-in-react/

https://www.altogic.com/blog/difference-between-controlled-and-uncontrolled-component

https://legacy.reactjs.org/docs/forms.html#controlled-components
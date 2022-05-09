---
title: "react 使用方法"
date: 2022-05-09T09:03:18+08:00
tags:
categories:
draft: false
---





## Hooks



### 1. forceUpdate

```jsx
const [state, updateState] = React.useState();
const forceUpdate = React.useCallback(() => updateState({}), []);
```





## Class Componet

### 1.forceUpdate

```javascript
 this.forceUpdate();
```


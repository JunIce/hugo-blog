---
title: "React redux源码解读"
date: 2022-05-02T08:08:24+08:00
draft: true
tags: ["react","redux"]
categories: ["React"]
---



# React Redux



>  "version": "5.0.0-alpha.0"





## applyMiddleware



>  ({ getState, dispatch }) => next => action

`middleware`是`redux`中重要的工具函数。传入的中间件函数会按次序进行调用，以此增强`redux`的功能，比如日志中间件等，可以监控到每个`action`的行为



1. `middleware`返回了一个闭包函数，把外部的`createStore`、`reducer`等传入进来，在内部生成了一个`store`

2. 内部把`middleware`重新组装成一个函数数组

3. 通过`compose`函数生成新的`dispatch` 函数, `compose`传入的参数是`store.dispatch`方法

   这里就能理解，在书写`middleware`函数时，next参数，也就是第2个参数，其实就是这个`store.dispatch`方法

4. 最终返回`store`，只不过`store`的`dispatch`方法被重写了



```typescript
export default function applyMiddleware(
  ...middlewares
){
  return (createStore) => (reducer,preloadedState) => {
      const store = createStore(reducer, preloadedState)
      let dispatch: Dispatch = () => {
        
      }

      const middlewareAPI: MiddlewareAPI = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args)
      }
      const chain = middlewares.map(middleware => middleware(middlewareAPI))
      dispatch = compose<typeof dispatch>(...chain)(store.dispatch)

      return {
        ...store,
        dispatch
      }
    }
}
```





### compose



compose是redux中比较重要的一个函数概念，redux中的插件机制就是通过这个方法实现的

compose巧妙的使用了数组的reduce方法，即数组循环调用，上一次的返回值可以作为下一次循环的参数的行为，实现了一个函数套函数的闭包函数，最终compose返回一个高阶函数



```typescript
export default function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    // infer the argument type so it is usable in inference down the line
    return <T>(arg: T) => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce(
    (a, b) =>
      (...args: any) =>
        a(b(...args))
  )
}
```



最后这里使用了多个箭头函数，稍微复原

```javascript
return funcs.reduce((a, b) => {
    return function(){
      return a(b(...arguments))
    }
})
```



## createStore



`createStore` 也就是我们的主入口函数



### 用法

```javascript
import { createStore } from 'redux'

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text])
    default:
      return state
  }
}

const store = createStore(todos, ['Use Redux'])

store.dispatch({
  type: 'ADD_TODO',
  text: 'Read the docs'
})

console.log(store.getState())
```





1. ### 有`enhancer`函数



最终其实就是返回的我们`applyMiddleware`最终的返回值，只不过把store的初始化放入到middleware中去了



```
 return enhancer(createStore)(
  reducer,
  preloadedState as PreloadedState<S>
) 
```









## combineReducers



combileReducers可以融合多个reducer为一个大的reducer，最终会返回一个大的reducer对象





```typescript
export default function combineReducers(reducers: ReducersMapObject) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers: ReducersMapObject = {}
  // 遍历reducerKeys数组，把对应的赋值到finalReducers对象上
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }

  // 取出finalReducers上对应的key数组
  const finalReducerKeys = Object.keys(finalReducers)

  // This is used to make sure we don't warn about the same
  // keys multiple times.
  // 用作同一个key不重复报错的
  let unexpectedKeyCache: { [key: string]: true }
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {}
  }

  let shapeAssertionError: unknown
  try {
    assertReducerShape(finalReducers)
  } catch (e) {
    shapeAssertionError = e
  }

  // 返回一个闭包
  return function combination(
    state: StateFromReducersMapObject<typeof reducers> = {},
    action: AnyAction
  ) {
    if (shapeAssertionError) {
      throw shapeAssertionError
    }

    let hasChanged = false
    const nextState: StateFromReducersMapObject<typeof reducers> = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      // 对应的key和reducer
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      // 变化之前的state
      const previousStateForKey = state[key]
      // 变化只后的state
      const nextStateForKey = reducer(previousStateForKey, action)
      // 这里可以看到reducer不能没有返回值，默认行为也要返回state本身
      if (typeof nextStateForKey === 'undefined') {
        const actionType = action && action.type
      }
      // state赋值行为
      nextState[key] = nextStateForKey
      // 是否变化
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length
      // 返回state
    return hasChanged ? nextState : state
  }
}
```


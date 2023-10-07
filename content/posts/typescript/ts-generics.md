---
title: "typescript 泛型类型"
date: 2022-05-13T22:06:59+08:00
tags: ["typescript"]
categories: ["typescript"]
draft: false
---



## Partial



可选类型, 把原本必选的参数都改成可选参数

```typescript
interface Crew {
  age: number;
  name: string;
}

const Jerry:Crew = {
    age: 10,
    name: 'jack'
};

type AnonymousPeople = Partial<Crew>;

const tom: AnonymousPeople = {
    name: 'Tom'
};
```







## keyof



keyof用于获取对象的key

```ts
type Point = {
  x: number;
  y: number;
}

type KPoint = keyof Point; // x | y
```



## typeof



```ts

const point = {
a : 1,
b: 'test'
}
type P = keyof typeof point; // type '"a" || "b"'

const coordinate: P = 'z' // Type '"z"' is not assignable to type '"a" | "b"'.
```



## infer



推断返回类型



```ts
const add = (x: number, y: number) => x + y
type D = ReturnType<typeof add> // number
```



```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
```



> infer 的作用是让 TypeScript 自己推断，并将推断的结果存储到一个类型变量中，infer 只能用于 extends 语句中。



## extends



1. 条件类型是一种由条件表达式所决定的类型

2. 条件类型使类型具有了不唯一性，增加了灵活性

   

> T extends U ? X : Y



若类型T可以被赋值给类型U， 则返回X， 否则返回Y



> A extends B



A是B的超集，A包括B所有的属性，甚至更多

`A extends B` is a lot like ‘`A` is a superset of `B`’, or, to be more verbose, ‘`A` has all of `B`’s properties, *and maybe some more*’.



## any & unknown



顶层类型



- **any**:  绕过类型检查，直接可用
- **unknown**： 必须判断类型才能使用





## never & void



- **never**： 任何类型都不赋值， 只能是**never**
- **void**： 可以被赋值的类型











## 类型约束



```typescript
type MyType<T> = T extends { message: any } ? T["message"] : never
```





## 内置类型函数



```typescript
// Exclude null and undefined from T
// 判断是否为undefined
type NonNullable<T> =
  T extends null | undefined ? never : T

// Obtain the parameters of a function type in a tuple
// 类型判断
type Parameters<T> =
  T extends (...args: infer P) => any ? P : never

// Obtain the parameters of a constructor function type in a tuple
type ConstructorParameters<T> =
  T extends new (...args: infer P) => any ? P : never

// Obtain the return type of a function type
// 返回值推断
type ReturnType<T> =
  T extends (...args: any[]) => infer R ? R : any

// Obtain the return type of a constructor function type
// 
type InstanceType<T> =
  T extends new (...args: any[]) => infer R ? R : any
```





## 示例



```typescript
type Action =
  {
    type: "INIT"
  }
  | {
    type: "SYNC"
  }
  | {
    type: "LOG_IN"
    emailAddress: string
  }
  | {
    type: "LOG_IN_SUCCESS"
    accessToken: string
  }


type ActionType = Action["type"]

type ExcludeTypeKey<T> = T extends "type" ? never : T

type ExcludeTypeArguments<A, T> = A extends { type: T }
  ? {
    [k in Exclude<keyof A, 'type'>]: A[k]
  }
  : never


function dispatch<T extends ActionType>(type: T, args: ExcludeTypeArguments<Action, T>) {

}


dispatch("LOG_IN", {
  emailAddress: '123'
})

dispatch("INIT", {})
```



## Required

通过 -? 移除了可选属性中的 ?，使得属性从可选变为必选的。

```ts
/**
 * Make all properties in T required
 */
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```



## 引用



https://artsy.github.io/blog/2018/11/21/conditional-types-in-typescript/
---
title: "typescript -- 基础知识"
date: 2022-03-20T08:57:39+08:00
draft: true
tags: ["typescript"]
categories: ["Typescript"]
---

# Typescript



## interface 和 type

都是用来定义数据类型的，规范数据对象的

### 相同点

```ts
interface User {
    name: string
    age: number
    setAge(age: number) : void
}
type User  = {
    name: string
    age: number
    setAge(age: number): void
}

type User = (age:number) => void 
```

- Implements

  class实现type和interface接口的方式都是一样的, **其中type不能实现联合类型的接口**

```tsx
interface Point {
  x: number;
  y: number;
}

class SomePoint implements Point {
  x = 1;
  y = 2;
}

type Point2 = {
  x: number;
  y: number;
};

class SomePoint2 implements Point2 {
  x = 1;
  y = 2;
}

type PartialPoint = { x: number; } | { y: number; };

// 这里不能实现一个type联合类型的接口
class SomePartialPoint implements PartialPoint {
  x = 1;
  y = 2;
}
```



### 不同点

- `type`可以定义成  **原始数据类型** & **联合类型** & **元组**，`interface`不可以

```ts
type Name = string // type 可设置原始类型

// 联合类型
type PointX = {
  x: number
}
type PointY = {
  y: number
}
type Point = PointX | PointY

// 组合成tuple
type tuple = [number, string]
let t: tuple = [1, '1']
```

- 扩展语法不同

  - **interface extends interface**

    

  ```ts
  interface PartialPointX { x: number; }
  interface Point extends PartialPointX { y: number; }
  ```

  - **Type alias extends type alias**

  

  ```tsx
  type PartialPointX = { x: number; };
  type Point = PartialPointX & { y: number; };
  ```

  

  - **Interface extends type alias**

    

  ```tsx
  type PartialPointX = { x: number; };
  interface Point extends PartialPointX { y: number; }
  ```

  - **Type alias extends interface**

  ```ts
  interface PartialPointX { x: number; }
  type Point = PartialPointX & { y: number; };
  ```

- interface 可以而 type 不行, **自动类型合并**

```ts
// interface 自动merging
interface User { name: string }
interface User { age: number }

let u: User = {
    name: 'zz',
    age: 2
} // 参数必须都要有
```



## extends

### 继承

```typescript
interface Animal {
	type: string;
}

interface Dog extends Animal {
	run(): void;
}

let dog: Dog = {
  type: 'dog',
  run: () => {}
} 

```



### 范型约束

redux 里 dispatch 一个 action，必须包含 `type`属性

```typescript
interface Dispatch<T extends { type: string }> {
  (action: T): T
}
```



### 条件类型

```typescript
T extends U ? X : Y // 若T能够赋值给U，那么类型是X，否则为Y
```



#### 值匹配

```typescript
type Equal<T, U> = T extends U ? true : false

type ENum = Equal<1, 1> // true

type EStr = Equal<'abc', 'abc'> // true
```



#### 类型匹配



```typescript
type GetType<T> = T extends number ? number : string;

type Num = GetType<1>   // number;
type Str = GetType<'1'> // string;
```



#### 嵌套类型匹配



```typescript
type GetType<T> = T extends number ? 'number'
								: T extends string ? 'string'
								: T extends boolean ? 'boolean'
								: T extends Function ? 'function'
								: 'object'


type T0 = GetType<string>;  // "string"
type T1 = GetType<"a">;     // "string"
type T2 = GetType<true>;    // "boolean"
type T3 = GetType<() => void>;  // "function"
type T4 = GetType<string[]>;    // "object"

```



#### 判断联合类型



```typescript
type A = 'x'
type B = 'x' | 'y'
type Y = A extends B ? true : false; // true
```



#### 推迟解析条件类型

分配律是指，`将联合类型的联合项拆成单项`，分别代入条件类型，然后将每个单项代入得到的结果再联合起来，得到最终的判断结果。

```typescript
type B = 'x' | 'y'
// T 等于除匹配类型的额外所有类型（官方叫候选类型）
type Merge<T> = T extends 'a' ? B : T;
type Values = Merge<"a" | "b"> // "b" | "x" | "y"


// T 等于匹配的类型，然后加上 B 联合类型一起返回
type Merge2<T> = T extends 'a' ? T : B;
type Values = Merge<"a" | "b"> // "x" | "y" | "a"

```



#### 过滤类型函数

```typescript
type Diff<T, K> = T extends K ? never : T

type Values = Diff<"x" | "y" | "z", "x">;
// 得到 type Values = "y" | "z"

```











## never & unknown & any & void

`any` 任意类型

`void`: 和any相反，表示无任何类型

`unknown` 未知类型。 类型是 `any` 类型对应的安全类型。

`never` 类型表示那些永不存在的值的类型。比如函数抛出错误，这个函数永远也不会有返回值



```typescript
function throwNewError(err: string): never {
	throw new Error(err)
}
```





## infer

可以在 `extends` 条件语句中使用 `infer` 关键字来声明一个待推断的类型变量。

`infer` 的作用是让 `TypeScript` 自己推断，并将推断的结果存储到一个类型变量中，`infer` 只能用于 `extends` 语句中。

- 实现待推断类型

```typescript
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer U ? U : never;
```

- 元组转联合类型

```typescript
type Flatten<T> = T extends Array<infer U> ? U : never;

type T0 = [string, number]
type T1 = Flatten<T0> // string | number

```



## keyof

类型映射为一个名称所组成的联合类型

```ts
type Point = {
  x: number;
  y: number;
}

type KPoint = keyof Point; // x | y
```

```typescript
interface Person {
	name: string;
	age: number;
	address: string;
}

type XiaoWang = keyof Person; // name | age | address

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

## in

可以用作遍历枚举

```typescript
type Person = 'name' | 'age' | 'address'
type PersonKey = {
  [p in Person]: string;
}

type PersonKey = {
  name: string;
  age: string;
  address: string;
}

```


---
title: "typescript -- 基础知识"
date: 2022-03-20T08:57:39+08:00
draft: true
tags: ["typescript"]
categories: ["Typescript"]
---



# Typescript





**模式匹配做提取，重新构造做变换。**

**递归复用做循环，数组长度做计数。**

**联合分散可简化，特殊特性要记清。**

**基础扎实套路熟，类型体操可通关。**





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

**高级类型的特点是传入类型参数，经过一系列类型运算逻辑后，返回新的类型。**



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



## 联合类型

当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候，TypeScript 会把每一个元素单独传入来做类型运算，最后再合并成联合类型，这种语法叫做分布式条件类型。



## ts中类型系统的加减乘除

TypeScript 类型系统中没有加减乘除运算符，但是可以通过构造不同的数组然后取 length 的方式来完成数值计算，把数值的加减乘除转化为对数组的提取和构造。




## ts中判断类型是否是联合类型

```typescript
type IsUnion<A, B = A> =
    A extends A
        ? [B] extends [A]
            ? false
            : true
        : never
```



- `A extends A` 触发分布式条件类型， 如果是组合类型的话，会把每个类型单独传入
- `[B] extends [A] ` 判断B整体和A的子元素类型是否一样
  - 如果A是联合类型，此时传入的类型是A的子元素，而B是一个整体，所以不相等
  - 如果A是普通的类型，其他类型没有做过特殊处理，所以这里B和A就是相等的




## 联合类型

联合类型中的每个类型都是相互独立的，TypeScript 对它做了特殊处理，也就是遇到字符串类型、条件类型的时候会把每个类型单独传入做计算，最后把每个类型的计算结果合并成联合类型。



## 特殊类型

any 类型与任何类型的交叉都是 any，也就是 1 & any 结果是 any。




## 元组和数组的区别

元组和数组的 length 属性值不一样

- 数组的length是数字（具体的值）
- 元组的length是number

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/492925f74eec45479dd42e214849d752~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95774c6e1c684614bc3eb0055bc456f2~tplv-k3u1fbpfcp-watermark.image?)



### 逆变 & 协变

- 逆变： 如果父类型可以赋值给子类型
- 协变： 如果子类型可以赋值给父类型



### 联合类型转交叉类型

```typescript
type MyUnionToIntersection<U> = (
    U extends U ? (x: U) => unknown : never
) extends (x: infer R) => unknown
    ? R
    : never;
```



### 可选索引的值为 undefined 和值类型的联合类型

```typescript
type MyGetOptional<U extends Record<string, any>> = {
    [
        K in keyof U as {} extends Pick<U, K> ? K : never 
    ] : U[K]
}
```





### 索引签名特点

索引签名不能构造成字符串字面量类型，因为它没有名字，而其他索引可以。

```typescript
type RemoveIndexSignature<Obj extends Record<string, any>> = {
  [
      Key in keyof Obj 
          as Key extends `${infer Str}`? Str : never
  ]: Obj[Key]
}
```





keyof 只能拿到 class 的 public 索引，private 和 protected 的索引会被忽略

```typescript
type ClassPublicProps<Obj extends Record<string, any>> = {
    [Key in keyof Obj]: Obj[Key]    
}
```





- any 类型与任何类型的交叉都是 any，也就是 1 & any 结果是 any，可以用这个特性判断 any 类型。
- 联合类型作为类型参数出现在条件类型左侧时，会分散成单个类型传入，最后合并。
- never 作为类型参数出现在条件类型左侧时，会直接返回 never。
- any 作为类型参数出现在条件类型左侧时，会直接返回 trueType 和 falseType 的联合类型。
- 元组类型也是数组类型，但每个元素都是只读的，并且 length 是数字字面量，而数组的 length 是 number。可以用来判断元组类型。
- 函数参数处会发生逆变，可以用来实现联合类型转交叉类型。
- 可选索引的索引可能没有，那 Pick 出来的就可能是 {}，可以用来过滤可选索引，反过来也可以过滤非可选索引。
- 索引类型的索引为字符串字面量类型，而可索引签名不是，可以用这个特性过滤掉可索引签名。
- keyof 只能拿到 class 的 public 的索引，可以用来过滤出 public 的属性。
- 默认推导出来的不是字面量类型，加上 as const 可以推导出字面量类型，但带有 readonly 修饰，这样模式匹配的时候也得加上 readonly 才行。



### QueryString

```typescript
// queryString
type MyQueryStr<T extends string> = T extends `${infer First}&${infer Rest}`
    ? MergeParams<ParseQuery<First>, MyQueryStr<Rest>>
    : ParseQuery<T>;
type ParseQuery<T extends string> = T extends `${infer First}=${infer Last}`
    ? { [K in First]: Last }
    : never;
type MergeParams<
    OneParam extends Record<string, any>,
    OtherParam extends Record<string, any>
> = {
    [Key in keyof OneParam | keyof OtherParam]: Key extends keyof OneParam
        ? Key extends keyof OtherParam
            ? MergeValues<OneParam[Key], OtherParam[Key]>
            : OneParam[Key]
        : Key extends keyof OtherParam
        ? OtherParam[Key]
        : never;
};
type MergeValues<One, Other> = One extends Other
    ? One
    : Other extends unknown[]
    ? [One, ...Other]
    : [One, Other];


type p61 = MyQueryStr<'a=1&b=2&c=3&d=4'>

```



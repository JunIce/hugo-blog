---
title: "typescript 学习笔记"
date: 2022-09-16T19:54:23+08:00
tags: ["typescript"]
categories: ["typescript"]
draft: false
---



## 模式提取



### 推导值类型

```typescript
type p = Promise<"hello">;
type MyGetValueResult<P> = P extends Promise<infer S> ? S : never;
type pr = MyGetValueResult<p>;
```



### 推导数组元素

```typescript
// First
type f = [1, 2, 3];
type MyGetFirst<P extends unknown[]> = P extends [infer F, ...unknown[]]
    ? F
    : never;
type f1 = MyGetFirst<f>;

// Last
type l = [1, 2, 3];
type MyGetLast<P extends unknown[]> = P extends [...unknown[], infer F]
    ? F
    : never;
type f2 = MyGetLast<f>;
```



### 数组中的pop和shift方法

```typescript
// pop
type MyPop<P extends unknown[]> = P extends [...infer F, unknown]
    ? F
    : never;
type p3 = MyPop<l>

// shift
type MyShift<P extends unknown[]> = P extends [unknown, ...infer F]
    ? F
    : never;
type p4 = MyShift<l>
```



### 字符串startWiths、replace、trim方法

```typescript
// startWiths
type MyStartWiths<S extends string, P extends string> = S extends `${P}${string}` ? true : false

type p5 = MyStartWiths<"hello world", "hel">

// replace
type MyReplace<S extends string, F extends string, T extends string> = S extends `${infer Start}${F}${infer End}` ? `${Start}${T}${End}` : S

type p6 = MyReplace<"hello world", "ll", "ooo">

// trim
type TrimLeft<Str extends string> = Str extends `${
    | " "
    | "\n"
    | "\t"}${infer Rest}`
    ? TrimLeft<Rest>
    : Str;
type TrimRight<Str extends string> = Str extends `${infer Rest}${
    | " "
    | "\n"
    | "\t"}`
    ? TrimRight<Rest>
    : Str;
type MyTrim<Str extends string> = TrimLeft<TrimRight<Str>>;

type AB = MyTrim<"   boss   ">;
```



### 推导函数参数

```typescript
// get param
type MyGetParam<F extends Function> = F extends (...args: infer Arg) => unknown ? Arg : never;
type p7 = MyGetParam<(name: string, age: number) => {}>
```



### 推导函数返回值

```typescript
// get return type
type MyGetReturn<F extends Function> = F extends () => infer T ? T : never;
type p8 = MyGetReturn<() => string[]>
```



### 推导构造函数

```typescript
// get Constructor type
type Person = {
    name: string
}
type PersonContructor = {
    new(name: string): Person;
}

type MyGetContrucstorType<T extends new(...args: any) => any> = T extends new(...args: any) => infer S ? S : never;
type MyGetContrucstorParamsType<T extends new(...args: any) => any> = T extends new(...args: infer S) => any ? S : never;

type p9 = MyGetContrucstorType<PersonContructor>
type p10 = MyGetContrucstorParamsType<PersonContructor>
```



### 提取复合类型中某一个属性的类型

```typescript
// get props ref
type MyGetPropsRefType<Props extends {}> = 
    'ref' extends keyof Props 
        ? 
            Props extends {ref ?: infer P | undefined } 
                ? P : never
        :   never

type p11 = MyGetPropsRefType<{ref: number}>
type p12 = MyGetPropsRefType<{ref: undefined}>
```



## 重新构造



### push 和 unshift

对于已有的数组类型进行添加元素

```typescript
// push
type MyPush<Arr extends unknown[], P> = [...Arr, P]
type p13 = MyPush<[1,2,3], 4>

// unshift
type MyUnshift<Arr extends unknown[], P> = [P, ...Arr]
type p14 = MyUnshift<[1,2,3], 4>
```



### zip

```typescript
type MyZip<T extends unknown[], S extends unknown[]> = 
  T extends [infer T1, ...infer T2] ?
      S extends [infer S1, ...infer S2] ?
          [[T1, S1], MyZip<T2, S2>]
          : []
      :[]

type p15 = MyZip<["a", "b", "c"], [1, 2, 3]>
```



字符串Uppercase、camelCase

```typescript
// uppercase
type MyUpperCase<S extends string> = S extends `${infer F}${infer Rest}` ? `${Uppercase<F>}${Rest}` : S
type p16 = MyUpperCase<"hello">

// camelCase
type MyCamelCase<S extends string> = S extends `${infer Left}_${infer R}${infer Rest}` ? `${Left}${Uppercase<R>}${MyCamelCase<Rest>}` : S

type p17 = MyCamelCase<'hello_hello_hello_world'>
```



### 删除部分字符串

```typescript
// dropsubstr
type MyDropStr<S extends string, D extends string> = S extends `${infer Left}${D}${infer L}` ? MyDropStr<`${Left}${L}`, D> : S

type p18 = MyDropStr<"hello_hello_hello_world", "l">
```



### 函数参数添加其他参数

```typescript
// append function args
type MyAppendArgs<F extends Function, Arg> = F extends (...args: infer Args) => infer ReturnType ? (...args: [...Args, Arg]) => ReturnType : never;

type p19 = MyAppendArgs<(a: number, b: string) => any, boolean>
```



### 索引类型

```typescript
// index object
type obj = {
    readonly name: string;
    age?: number;
    gender: boolean;
}

type MyMapping<Obj extends object> = {
    [K in keyof Obj]: [Obj[K], K]
}

type p20 = MyMapping<{ a: 1, b: 2 }>
```



### 类型对象key转大写

```typescript
// uppercase key
type MyUpperCaseKey<Obj extends object> = {
    [K in keyof Obj as Uppercase<K & string>]: Obj[K]
}
type p21 = MyUpperCaseKey<{ acc: 1, b: 2 }>
```



### 改变类型readonly、partial

```typescript
// readonly
type MyReadonly<T> = {
    readonly [K in keyof T] : T[K]
}
type p22 = MyReadonly<obj>

// partial

type MyPartial<T> = {
    [K in keyof T] ?: T[K]
}
type p23 = MyPartial<obj>
```



### 修改部分类型的只读、必填

```typescript
// mutable
type MyMutable<T> = {
    -readonly [K in keyof T] ?: T[K]
}
type p24 = MyMutable<obj>

// required
type MyRequired<T> = {
    [K in keyof T] -?: T[K]
}
type p25 = MyRequired<obj>
```





### 过滤出索引类型中指定的类型

```typescript
// filterValueType
type MyFilterByType<T extends MyRecord<string, any>, ValueType> = {
    [K in keyof T as T[K] extends ValueType ? K : never] : T[K]
}
type p26 = MyFilterByType<obj, string>
```




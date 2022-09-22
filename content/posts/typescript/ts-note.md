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



### 推断出Promise的返回类型

```typescript
type MyPromiseValueType<T> = T extends Promise<infer S>
    ? MyPromiseValueType<S>
    : T;

type p27 = MyPromiseValueType<Promise<Promise<Promise<string>>>>;
```



### 数组类型反转

```typescript
type MyReverse<T extends unknown[]> = T extends [infer First, ...infer Rest]
    ? [...MyReverse<Rest>, First]
    : [];
type p28 = MyReverse<[1, 2, 3, 4, 5]>;

type IsEqual<A, B> = (A extends B ? true : false) &
    (B extends A ? true : false);
```



### 递归判断数组中是否含有指定类型

```typescript
type MyInclude<T extends unknown[], S> = T extends [infer First, ...infer Rest]
    ? IsEqual<S, First> extends true
        ? true
        : MyInclude<Rest, S>
    : false;

type p29 = MyInclude<[1, 2, 3, 4], 4>;
type p30 = MyInclude<[1, 2, 3, 4], 5>;
```



### 删除数组类型中某一个元素

```typescript
type MyRemoveItem<
    T extends unknown[],
    S,
    R extends unknown[] = []
> = T extends [infer First, ...infer Rest]
    ? IsEqual<S, First> extends true
        ? MyRemoveItem<Rest, S, R>
        : MyRemoveItem<Rest, S, [...R, First]>
    : R;

type p31 = MyRemoveItem<[1, 2, 3, 4], 3>;
```



### 创建一个指定长度的数组类型

```typescript
type MyBuildArray<
    L extends number,
    El extends unknown = unknown,
    Result extends unknown[] = []
> = Result["length"] extends L ? Result : MyBuildArray<L, El, [...Result, El]>;

type p32 = MyBuildArray<6, 1>;
```



### 替换字符串类型中指定类型

```typescript
type MyReplaceAll<
    Str extends string,
    From extends string,
    To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
    ? `${Prefix}${To}${MyReplaceAll<Suffix, From, To>}`
    : Str;

type p33 = MyReplaceAll<"hello_world", "l", "a">;
```



### 字符串类型转换成元组类型

```typescript
type MyStrToUnion<Str extends string> =
    Str extends `${infer First}${infer Rest}`
        ? `${First}` | `${MyStrToUnion<Rest>}`
        : never;

type p34 = MyStrToUnion<"hello">;
```



### 递归反转字符串类型

```typescript
type MyReverseStr<
    Str extends string,
    R extends string = ""
> = Str extends `${infer First}${infer Rest}`
    ? MyReverseStr<Rest, `${First}${R}`>
    : R;

type p35 = MyReverseStr<"hello">;
```



### 嵌套对象类型转换成readonly

```typescript
type MyDeepReadonly<Obj extends Record<string, any>> = Obj extends any
    ? {
          readonly [k in keyof Obj]: Obj[k] extends object
              ? Obj[k] extends Function
                  ? Obj[k]
                  : MyDeepReadonly<Obj[k]>
              : Obj[k];
      }
    : never;

type obj1 = {
    a: {
        b: {
            c: {
                f: () => "dong";
                d: {
                    e: {
                        guang: string;
                    };
                };
            };
        };
    };
};

type p36 = MyDeepReadonly<obj1>;
```



### 类型中的加法

```typescript
type MyAdd<A extends number, B extends number> = [
    ...MyBuildArray<A>,
    ...MyBuildArray<B>
]["length"];
type p37 = MyAdd<12, 34>;
```



### 类型中的减法

```typescript
// substract
type MySubStract<A extends number, B extends number> = MyBuildArray<A> extends [
    ...MyBuildArray<B>,
    ...infer Rest
]
    ? Rest["length"]
    : never;
type p38 = MySubStract<34, 12>;
```



### 类型中的乘法

```typescript
// mutiply
type MyMutiply<
    A extends number,
    B extends number,
    Result extends unknown[] = []
> = B extends 0
    ? Result["length"]
    : MyMutiply<A, MySubStract<B, 1>, [...MyBuildArray<A>, ...Result]>;

type p39 = MyMutiply<2, 5>;
```



### 类型中的除法

```typescript
type MyDivide<
    Num1 extends number,
    Num2 extends number,
    Count extends unknown[] = []
> = Num1 extends 0
    ? Count["length"]
    : MyDivide<MySubStract<Num1, Num2>, Num2, [unknown, ...Count]>;

type p40 = MyDivide<20, 5>;
```



### 字符串长度

```typescript
type MyStrLength<
    S extends string,
    Count extends unknown[] = []
> = S extends `${string}${infer Rest}`
    ? MyStrLength<Rest, [unknown, ...Count]>
    : Count["length"];

type p41 = MyStrLength<"hello">;
```



### 比较两个数的大小

```typescript
type MyGreaterThen<
    Num1 extends number,
    Num2 extends number,
    Count extends unknown[] = []
> = Num1 extends Num2
    ? false
    : Count["length"] extends Num2
    ? true
    : Count["length"] extends Num1
    ? false
    : MyGreaterThen<Num1, Num2, [unknown, ...Count]>;


type p42 = MyGreaterThen<20, 21>
type p43 = MyGreaterThen<20, 19>
```



### 联合类型中指定字符大写

```typescript
// union
type a1 = "a" | "b" | "c";
type MyUpperCaseA<T extends string> = T extends "a" ? MyUpperCase<T> : T;
type p44 = MyUpperCaseA<a1>;
```



### 删除置顶位置字符串，并且指定字符大写

```typescript
// camelCase
type MyCamelCaseNext<T extends string> =
    T extends `${infer L}_${infer R}${infer Rest}`
        ? `${L}${Uppercase<R>}${MyCamelCaseNext<Rest>}`
        : T;

type p45 = MyCamelCaseNext<"aa_bb_cc">;
```



### 数组元素中每个元素都进行处理

```typescript
type MyCamelCaseArr<Arr extends unknown[]> = Arr extends [
    infer Item,
    ...infer Rest
]
    ? [MyCamelCaseNext<Item & string>, ...MyCamelCaseArr<Rest>]
    : [];

type p46 = MyCamelCaseArr<['aa_aa_aa', 'bb_bb_bb', 'cc_cc_cc']>
```



联合类型处理

```typescript
type p47 = MyCamelCaseNext<'aa_aa_aa' | 'bb_bb_bb' | 'cc_cc_cc'>
```



### 是否是联合类型

```typescript
type IsUnion<A, B = A> = A extends A ? 
    [B] extends [A] ? false : true
    : never

type p48 = IsUnion<'aa_aa_aa' | 'bb_bb_bb' | 'cc_cc_cc'>
type p49 = IsUnion<'aa'>
```



### 数组转联合类型

```typescript
type MyUnionTest = ['aaa', 'bbb'][number]
```



```typescript
// 数组转Union
type MyUnionTest = ['aaa', 'bbb'][number]

type MyBEM<Block extends string, Element extends string[], Modifiers extends string[]> = `${Block}__${Element[number]}--${Modifiers[number]}`

type bemResult = MyBEM<'hello', ['aaa', 'bbb'], ['warning', 'success']>;
```



### 联合类型两两组合问题

```typescript
// combination
type Combination<A extends string, B extends string> = A | B | `${A}${B}`| `${B}${A}`

type p50 = Combination<'a', 'b'>

type MyAllCombination<A extends string, B extends string = A> = A extends A ? Combination<A, MyAllCombination<Exclude<B, A>>> : never;

type p51 = MyAllCombination<'a'| 'b'|'c'>
```



### IsAny

```typescript
// is any
type MyIsAny<T> = 'a' extends ('b' & T) ? true : false
type p52 = MyIsAny<any>
```



### IsEqual

```typescript
// isEqual
type MyIsEqual<A, B> =  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false

type p53 = MyIsEqual<'a', 'a'>
type p54 = MyIsEqual<'a', any>
```



### IsNever

```typescript
// isNever
type MyIsNever<T> = [T] extends [never] ? true : false;
type p55 = MyIsNever<never>
type p56 = MyIsNever<'123'>
```



### IsTuple

```typescript
// isTuple
type MyNotEqual<A, B> = MyIsEqual<A, B> extends true ? false : true
type MyIsTuple<T> = T extends readonly [...params: infer Eles] ? MyNotEqual<Eles['length'], number> :false
type p57 = MyIsTuple<number[]>
type p58 = MyIsTuple<[1,2,3]>
```




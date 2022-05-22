---
title: "React Usage Issue"
date: 2022-05-14T15:32:41+08:00
tags:
categories:
draft: false
---







## not assignable to type LegacyRef\<xxxxx>



`useRef`定义一个ref时，报不能推断类型

```js
import React, { useRef, RefObject } from 'react';

function Test() 
{
    const node = useRef<HTMLElement>(null);

    if (
        node &&
        node.current &&
        node.current.contains()
    ){ console.log("current accessed")}

    return <div ref={ node }></div>
}
```



因为`useRef`是使用`HTMLElement`定义的泛型，所以说不能推断，改成ref所对应的标签泛型就可以了







## Cannot assign to 'current' because it is a read-only property



当在`react`中使用`useRef`定义`ref`时，报这样的错误, 因为结果走到`React.RefObject`



`useRef`有这3种定义

```typescript
function useRef<T>(initialValue: T): MutableRefObject<T>;

function useRef<T>(initialValue: T|null): RefObject<T>;

function useRef<T = undefined>(): MutableRefObject<T | undefined>;
```



1. useRef初始值设为null
2. useRef定义了一个初始的类型



```typescript
const elem = useRef<HTMLDivElement>(null);

type Test = typeof elem; // Test = React.RefObject<HTMLDivElement>
```
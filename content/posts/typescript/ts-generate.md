---
title: "typescript 注解解读1"
date: 2024-08-19T22:06:59+08:00
tags: ["typescript"]
categories: ["typescript"]
draft: false

---





## 源注解代码




```typescript
{ 
    readonly [K in keyof Defaults as K extends keyof T
    	? K
    	: never]-?: K extends keyof T
    	? Defaults[K] extends undefined
      	? IfAny<Defaults[K], NotUndefined<T[K]>, T[K]>
      	: NotUndefined<T[K]>
    	: never
}
```





## 解读



1. **索引签名和可选性**: `readonly [K in keyof Defaults as ...] -?`:
   - `readonly`: 表示生成的属性是只读的。
   - `[K in keyof Defaults]`: 定义了一个索引签名，遍历 `Defaults` 的所有键。
   - `as ...`: 这里是一个类型条件，用来过滤键。
   - `-?`: 可以移除或保留属性的可选项标记 (`?`)。在这个场景中，由于 `-?` 在条件之后，所以它不会立即应用。
2. **类型条件**:
   - `K extends keyof T ? K : never`: 这个条件确保只有那些同时存在于 `T` 和 `Defaults` 中的键才会被包含进来。
3. **内部类型条件**:
   - `K extends keyof T ? ... : never`: 再次确认 `K` 是 `T` 的键。
   - `Defaults[K] extends undefined ? ... : NotUndefined<T[K]>`: 检查`Defaults[K]`是否为`undefined`。
     - 如果是`undefined`:
       - 使用 `IfAny<Defaults[K], NotUndefined<T[K]>, T[K]>`。这里 `IfAny` 是一个自定义类型，用于处理当 `Defaults[K]` 为任何类型时的情况。如果 `Defaults[K]` 为任意类型（即 `any`），则结果类型是 `NotUndefined<T[K]>`；否则，结果类型是 `T[K]`。
     - 如果不是`undefined`:
       - 直接使用 `NotUndefined<T[K]>`，即去除 `T[K]` 的 `undefined` 值。
4. **辅助类型**:
   - `IfAny<T, U, V>`: 当 `T` 是 `any` 时选择 `U` 类型，否则选择 `V` 类型。
   - `NotUndefined<T>`: 去除类型 `T` 中的 `undefined`。

### 总结

最终生成的类型会根据 `Defaults` 中的值来决定 `T` 的属性类型：

- 如果 `Defaults[K]` 是 `undefined`，那么 `T[K]` 的类型会保持不变（除非 `T[K]` 本身就是 `undefined`，此时它会被替换为非 `undefined` 的类型）。
- 如果 `Defaults[K]` 不是 `undefined`，那么 `T[K]` 的类型将被限制为非 `undefined`。

注意：这里的 `IfAny` 和 `NotUndefined` 需要额外定义。
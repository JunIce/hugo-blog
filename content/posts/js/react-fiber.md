---
title: "React Fiber"
date: 2022-03-05T10:25:39+08:00
draft: true
categories: ["React"]
---


## React 架构

### React15 架构

- Reconciler (协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

<b>Reconciler</b>

我们知道，在 React 中可以通过 this.setState、this.forceUpdate、ReactDOM.render 等 API 触发更新。

每当有更新发生时，Reconciler 会做如下工作：

- 调用函数组件、或 class 组件的 render 方法，将返回的 JSX 转化为虚拟 DOM
- 将虚拟 DOM 和上次更新时的虚拟 DOM 对比
- 通过对比找出本次更新中变化的虚拟 DOM
- 通知 Renderer 将变化的虚拟 DOM 渲染到页面上

<b>Renderer</b>

React 支持跨平台，所以不同的平台有不同的Renderer

- ReactDOM 浏览器端
- ReactNative App原生
- ReactTest 测试
- ReactArt 渲染到canvas，svg等

<b>缺点：</b>

React15 中 Reconciler 对组件的mount或者update 都是会递归调用，同时会递归更新子组件。一旦子组件比较多，递归时间超过16ms，中途无法中断，就会出现卡顿。

### React16 架构

- <font color='red'>Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入 Reconciler</font>
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

<b>Scheduler</b>

调度器。以浏览器是否有剩余时间作为任务中断的标准，当浏览器有剩余时间时通知我们。

React官方实现了一个类似`requestIdleCallback`的`polyfill`.除了在空闲时触发回调的功能外，Scheduler 还提供了多种调度优先级供任务设置。

> Scheduler 是独立于 React 的库

部分浏览器已经实现了`requestIdleCallback`. 

> 1. 浏览器兼容性不好
> 2. 触发频率不稳定
> 3. requestIdleCallback FPS 只有20帧，远低于页面流畅度的要求60帧，即16.7ms

<b>Reconciler</b>

更新工作从递归变成了可以中断的循环过程。每次循环都会调用 shouldYield 判断当前是否有剩余时间。

Reconciler 与 Renderer 不再是交替工作。当 Scheduler 将任务交给 Reconciler 后，Reconciler 会为变化的虚拟 DOM 打上代表增/删/更新的标记,当所有的组件都完成更新后再交给`Renderer`重新渲染


## React Fiber

`Fiber` 中文翻译纤程， 与进程、线程同为程序执行过程，Fiber 就是比线程还要纤细的一个过程

一个`Fiber`代表一个`Javascript`对象， 用来表示一个`React Element`

`Fiber` 类型定义

```ts
export type Fiber = {
    // Tag identifying the type of fiber.
    tag: TypeOfWork,
 
    // Unique identifier of this child.
    key: null | string,
 
    // The value of element.type which is used to preserve the identity during
    // reconciliation of this child.
    elementType: any,
 
    // The resolved function/class/ associated with this fiber.
    type: any,
 
    // The local state associated with this fiber.
    stateNode: any,
 
    // Remaining fields belong to Fiber
 
    // The Fiber to return to after finishing processing this one.
    // This is effectively the parent.
    // It is conceptually the same as the return address of a stack frame.
    return: Fiber | null,
 
    // Singly Linked List Tree Structure.
    child: Fiber | null,
    sibling: Fiber | null,
    index: number,
 
    // The ref last used to attach this node.
    ref: null | (((handle: mixed) => void) & {_stringRef: ?string, ...}) | RefObject,
 
    // Input is the data coming into process this fiber. Arguments. Props.
    pendingProps: any, // This type will be more specific once we overload the tag.
    memoizedProps: any, // The props used to create the output.
 
    // A queue of state updates and callbacks.
    updateQueue: mixed,
 
    // The state used to create the output
    memoizedState: any,
 
    mode: TypeOfMode,
 
    // Effect
    effectTag: SideEffectTag,
    subtreeTag: SubtreeTag,
    deletions: Array<Fiber> | null,
 
    // Singly linked list fast path to the next fiber with side-effects.
    nextEffect: Fiber | null,
 
    // The first and last fiber with side-effect within this subtree. This allows
    // us to reuse a slice of the linked list when we reuse the work done within
    // this fiber.
    firstEffect: Fiber | null,
    lastEffect: Fiber | null,
 
    // This is a pooled version of a Fiber. Every fiber that gets updated will
    // eventually have a pair. There are cases when we can clean up pairs to save
    // memory if we need to.
    alternate: Fiber | null,
  };
```

Fiber 通过构建两个tree： `current tree` 和 `workInProgress tree` 进行渲染

- current: 表示当前正在渲染的tree
- workInProgress：当进行更新时，会构建一个`workInProgress tree`, 当更新完毕后，当前的`workInProgress`会替换当前的`current`,成为`current tree`





- 参考

[https://blog.towavephone.com/react-technology-notes-idea/](https://blog.towavephone.com/react-technology-notes-idea/)

---
title: "typescript -- 问题笔记"
date: 2023-02-10T08:57:39+08:00
draft: true
tags: ["typescript"]
categories: ["Typescript"]
---

### property xxxx does not exist on type 'window & typeof globalthis'

```typescript

export {}

declare global {
    var app: {
        create(): void
    }
}

```

这样就可以使用`window.app.create()`


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

### Module not found: Error: Can't resolve '~entry' in 

vue-cli 在改造 ts过程中，打包库会出现报错

`"build": "vue-cli-service build --target lib --name micro  --dest lib ./src/index.ts"`

https://github.com/vuejs/vue-cli/issues/1641


```typescript
// This doesn't give you default export, thus the warning
export * from './components';

// This is dirty code but works. I recommend AGAINST it
// Also the entry would be `HelloWorld`, not `{ Helloworld }`
export { HelloWorld as default } from './components';

// Use this instead

import * as components from './components';
export default components;

// Alternatively, depending on what you want your lib to export

import * as components from './components';
export default components.HelloWorld;
```



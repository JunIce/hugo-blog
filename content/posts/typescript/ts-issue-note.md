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

### Syntax Error: Thread Loader

vue.config.js 中关闭 `parallel: false`


### Cannot find module '@/pages/test-flow.vue' or its corresponding type declarations.
ts不能识别vue文件

- 关闭volar（如果你在使用vue2，但是安装的vue3的插件）

- 声明文件

```typescript
declare module '*.vue';
```

###  Property 'install' is missing in type '{ micro: {}; }' but required in type 'PluginObject<any>'

引入第三方库的时候，报没有install方法

更改写法
```js
import * as ABC from "../lib/xxxx.umd.js";
```

### Exports and export assignments are not permitted in module augmentations.



### Unexpected aliasing of 'this' to local variable.

vue中由于this指向问题，出现eslint报错

解决方法就是对于this进行重新定义变量
```js
let that = this;
someFn(function(arg) {
  return that.foo = arg;
});
```

### use @Ref declare with ref in v-for element 

```typescript
<template>
    <div>
        <div v-for="index in 10" :key="index" ref="myRefs">
        	{{index}}    
    	</div>
    </div>
</template>

<script lang="ts">
import {Ref,Options,Vue} from 'vue-property-decorator'
export default Text extends Vue{
    @Ref() myRefs!: HTMLDivElement[];
}
</script>
```


### An interface declaring no members is equivalent to its supertype.

```typescript
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AuthConfig {}
```

```typescript
"rules": { "no-empty-interface": false }
```



### Cannot assign to 'current' because it is a read-only property

[(useRef) Cannot assign to 'current' because it is read-only property | bobbyhadz](https://bobbyhadz.com/blog/react-cannot-assign-to-current-because-read-only-property)

From

```js
const myRef = useRef<MyType>(null)
```

To

```js
const myRef = useRef<MyType | null>(null)
```





### 3.0000000000000004e+33  is beyond boundary when transfer to integer, the results may not be accurate



使用`decimal.js`

```js
const decimalJs = require("decimal.js")
const x = new decimalJs('9999999')
const res = x.times('9999999.99').toString()
console.log(`res`, res) // "99999989900000.01"

```



###  findDOMNode is deprecated in StrictMode.



```react
<React.StrictMode>
  <App />
</React.StrictMode>
```



删除`StrictMode`标签





### The left-hand side of an assignment expression may not be an optional property access.



```js
// This line threw
document.getElementById('output')?.innerHTML = url.toString()
```

chang to

```js
objectVariableName!.propertyName = 'some value to assign';
```


### This module is declared with using 'export =', and can only be used with a default import when using the 'allowSyntheticDefaultImports' flag.


```json
{
    "compilerOptions": {
        // ....
        "allowSyntheticDefaultImports": true,
    }
}
```



### Property does not exist on type 'DetailedHTMLProps, HTMLDivElement>'



给div设置行内样式style的时候报错

```tsx
  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: position.top + 10,
    left: position.left,
  };
```



定义样式为`React.CSSProperties`定义

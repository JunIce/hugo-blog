---
title: "Rollup -- javascript模块打包器整理"
date: 2022-07-23T08:35:32+08:00
tags:
categories: ["rollup"]
draft: false
---



# rollup



Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码



```javascript
npm install --global rollup
```



## Tree-shaking

在项目中使用es modules时，rollup会静态分析代码中引入代码，其中实际没有使用的代码在打包过程中被tree-shaking掉



## 打包能力

- 引入commonJs: 使用插件https://github.com/rollup/plugins/tree/master/packages/commonjs
- 引入esm文件





## options

### expernal

> (string | RegExp)[] | RegExp | string | (id: string, parentId: string, isResolved: boolean) => boolean



rollup在打包过程中，有部分依赖库不想打包到最终的bundle中时，就需要配置external， 比如开发的依赖库依赖vue，但是项目中vue是以cdn的形式引入到项目中的，所以这里就需要配置

```javascript
import path from 'path';

export default {
  ...,
  globals: {
  	vue: 'vue'
  },
  external: [
    'vue',
    path.resolve( __dirname, 'src/some-local-file-that-should-not-be-bundled.js' ),
    /node_modules/
  ]
};
```



- 如果在命令行中进行配置，需要以逗号分隔

```javascript
rollup -i src/main.js ... -e foo,bar,baz
```



- 当external是一个函数的时候，有3个参数可以拿到`id`, `parent`, `isResolved`

- 当创建一个`iife`或者`umd` bundle时，就必须提供全局变量名，通过设置`output.globals`

- 当一个相对路径的模块被标记成external时，系统会先将模块解析成一个绝对路径的模块，以便模块能进行合并，在打包结束后再将绝对路径的模块转换成相对路径

  

### input

打包的入口文件

> string | string [] | { [entryName: string]: string }

- input是一个数组或者对象时，表示是一个多入口的bundle，最终打包也会分成多个bundle
- 除非提供`output.file`选项，生成的chunk名称会依据`output.entryFileNames`配置
- 当使用对象时，最终bundle的文件名会根据对象的属性名进行命名



```javascript
export default {
  ...,
  input: {
    a: 'src/main-a.js',
    'b/index': 'src/main-b.js'
  },
  output: {
    ...,
    entryFileNames: 'entry-[name].js'
  }
};
```



### output

#### output.dir

生成文件的目录名

> string

当有多入口文件时配置目录名，单入口文件时， `output.file`配置会覆盖



#### output.file

最终生成的文件名

> string

单文件入口时可以配置这个属性



#### output.format

最终生成的bundle的类型

> string,  默认是'es'

- amd
- cjs
- es
- iife
- umd
- system



#### output.globals

生成的bundle需要全局注入变量的名称

Type: `{ [id: string]: string } | ((id: string) => string)`



如果是`umd`/`iife`, 这个globals是必须要进行配置的



```javascript
// rollup.config.js
export default {
  ...,
  external: ['jquery'],
  output: {
    format: 'iife',
    name: 'MyBundle',
    globals: {
      jquery: '$'
    }
  }
};

/*
var MyBundle = (function ($) {
  // code goes here
}($));
*/
```



#### output.name

配置最终bundle的名称

Type: `string`



#### output.plugins

输出的文件时使用插件

Type: `OutputPlugin | (OutputPlugin | void)[]`



```javascript
// rollup.config.js
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'main.js',
  output: [
    {
      file: 'bundle.js',
      format: 'es'
    },
    {
      file: 'bundle.min.js',
      format: 'es',
      plugins: [terser()]
    }
  ]
};
```



#### output.assetFileNames

Type: `string | ((assetInfo: AssetInfo) => string)`
CLI: `--assetFileNames <pattern>`
Default: `"assets/[name]-[hash][extname]"`

输出文件名的组合

- `[extname]`:  文件类型 `.js`

- `[ext]`: 文件类型 `js`

- `[hash]`: 文件名和内容的hash值

- `[name]`: 文件名



#### output.banner/output.footer

Type: `string | (() => string | Promise<string>)`
CLI: `--banner`/`--footer <text>`

输出特定的头部文件或者尾部文件插入到特定的位置,  可以返回一个Promise进行异步插入

```javascript
// rollup.config.js
export default {
  ...,
  output: {
    ...,
    banner: '/* my-library version ' + version + ' */',
    footer: '/* follow me on Twitter! @rich_harris */'
  }
};
```



#### output.compact

Type: `boolean`
CLI: `--compact`/`--no-compact`
Default: `false`

bundle代码是否进行压缩



#### output.entryFileNames

Type: `string | ((chunkInfo: ChunkInfo) => string)`
CLI: `--entryFileNames <pattern>`
Default: `"[name].js"`

多入口文件名的重命名

- `[format]`: 格式化名称 e.g. `es` or `cjs`.
- `[hash]`: 内容hash
- `[name]`: 文件名



#### output.extend

Type: `boolean`
CLI: `--extend`/`--no-extend`
Default: `false`

`umd`或者`iife`模式下会挂载到全局对象上



####  output.generatedCode

Type: `"es5" | "es2015" | { arrowFunctions?: boolean, constBindings?: boolean, objectShorthand?: boolean, preset?: "es5" | "es2015", reservedNamesAsProps?: boolean, symbols?: boolean }`
CLI: `--generatedCode <preset>`
Default: `"es5"`



生成最终代码的类型， 并不会更改用户代码，只是改变rollup的相关的帮助代码









### plugins

插件模块

Type: `Plugin | (Plugin | void)[]`



### cache

rollup可以增加cache配置，用来在watch模式下，提高打包的速度，rollup只会重新分析发生变化的模块。

Type: `RollupCache | false`

```javascript
const rollup = require('rollup');
let cache;

async function buildWithCache() {
  const bundle = await rollup.rollup({
    cache // is ignored if falsy
    // ... other input options
  });
  cache = bundle.cache; // store the cache object of the previous build
  return bundle;
}

buildWithCache()
  .then(bundle => {
    // ... do something with the bundle
  })
  .then(() => buildWithCache()) // will use the cache of the previous build
  .then(bundle => {
    // ... do something with the bundle
  });
```



### makeAbsoluteExternalsRelative

Type: `boolean | "ifRelativeSource"`

是否把绝对路径转换成相对路径。



### maxParallelFileOps

Type: `number`  20
CLI: `--maxParallelFileOps <number>`



配置并行写入chunk的文件数，这个最大值取决于系统允许值



### onwarn

Type: `(warning: RollupWarning, defaultHandler: (warning: string | RollupWarning) => void) => void;`

拦截警告信息，当发生警告时会进行回调

```javascript
// rollup.config.js
export default {
  ...,
  onwarn (warning, warn) {
    // skip certain warnings
    if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;

    // throw on others
    if (warning.code === 'NON_EXISTENT_EXPORT') throw new Error(warning.message);

    // Use default for everything else
    warn(warning);
  }
};
```




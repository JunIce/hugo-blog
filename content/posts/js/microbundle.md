---
title: "microbundle 源码"
date: 2023-08-19T20:31:50+08:00
tags: ["microbundle", "rollup"]
categories: ["js"]
draft: false
---





# microbundle 源码



microbundle 是一个零配置的js打包器，基于rollup进行的开发

不需要任何配置文件就可以打包出常用的`commonjs`, `umd`, `es`文件





## 基础使用



package.json



```json
{
  "name": "microbundle-demo",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/foo.cjs",          
  "module": "./dist/foo.module.js",
  "unpkg": "./dist/foo.umd.js",  
  "scripts": {
    "build": "microbundle src/index.ts",    
    "dev": "microbundle watch" 
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "microbundle": "^0.15.1"
  }
}
```

然后在自己的入口文件上进行开发

build就可以打包出目标库文件了



## 源码



- 解析配置

```ts
let options = { ...inputOptions };

options.cwd = resolve(process.cwd(), inputOptions.cwd);
const cwd = options.cwd;

```



- 从package.json中读取配置

```ts
const { hasPackageJson, pkg } = await getConfigFromPkgJson(cwd);
	options.pkg = {
		...pkg,
		...pkg.publishConfig,
	};

const { finalName, pkgName } = getName({
  name: options.name,
  pkgName: options.pkg.name,
  amdName: options.pkg.amdName,
  hasPackageJson,
  cwd,
});
```



- 读取入口配置、输出配置

```ts
options.input = await getInput({
		entries: options.entries,
		cwd,
		source: options.pkg.source,
		module: options.pkg.module,
	});

	options.output = await getOutput({
		cwd,
		output: options.output,
		pkgMain: options.pkg.main,
		pkgName: options.pkg.name,
	});

	options.entries = await getEntries({
		cwd,
		input: options.input,
	});
```



配置最终输出格式，并且把cjs放在第一个

```ts
let formats = (options.format || options.formats).split(',');
	// de-dupe formats and convert "esm" to "es":
	formats = Array.from(new Set(formats.map(f => (f === 'esm' ? 'es' : f))));
	// always compile cjs first if it's there:
	formats.sort((a, b) => (a === 'cjs' ? -1 : a > b ? 1 : 0));
```



多个入口文件创建多个步骤配置

```ts
	let steps = [];
	for (let i = 0; i < options.entries.length; i++) {
		for (let j = 0; j < formats.length; j++) {
			steps.push(
				createConfig(options, options.entries[i], formats[j], j === 0),
			);
		}
	}
```



这里并行打包，并保存缓存，这里cache其实是rollup的配置[cache](https://rollupjs.org/configuration-options/#cache)

```ts
let cache;
	let out = await series(
		steps.map(config => async () => {
			const { inputOptions, outputOptions } = config;
			if (inputOptions.cache !== false) {
				inputOptions.cache = cache;
			}
			let bundle = await rollup(inputOptions);
			cache = bundle;
			await bundle.write(outputOptions);
			return await config._sizeInfo;
		}),
	);
```






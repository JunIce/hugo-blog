
---
title: "webpack4 library项目改打包esm输出"
date: 2023-06-12T10:08:32+08:00
draft: true
tags: ["webpack4", "esm"]
categories: ["webpack"]
---



# webpack4 library项目改打包esm输出

## 1.升级webpack到webpack5

```package.json
    "webpack": "^5.91.0",
```


## 2.修改webpack.config

修改library的输出type为 `module`, 同时`module`改为`true`



```js
{
	// ...
	output: {
	  // ....
	  library: {
		type: 'module'
	  },
	  module: true
	},
    externals: {}, // externals
    experiments: {
      outputModule: true
    },
}
```


### 关闭代码压缩

```json
optimization: {
      minimize: false, // 关闭代码压缩
      // 其他optimization配置...
},
```
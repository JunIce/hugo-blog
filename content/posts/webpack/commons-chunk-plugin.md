---
title: "webpack 代码分片"
date: 2022-05-22T15:18:32+08:00
tags: ["webpack"]
categories: ["webpack"]
draft: false
---



# webpack CommonsChunkPlugin



代码分片是webpack中重要的优化手段，对于一个比较大的chunk，有必要提取出当前chunk中依赖的不经常变化的库





## usage



```javascript
new webpack.optimize.CommonsChunkPlugin()
```



## 配置项



```typescript
{
	 name: string, // 提取出来的chunk的名称
   names: string[], // 名称输入字符串数组时，相当于多次调用本插件
   filename: string, // 
   minSize: number,
   minChunks: number|Infinity|function(module, count) => boolean, // 最少引用次数
   chunks: string[], // 这里的chunks， 和入口部分的chunk一一对应，如果出现在其中，就会被单独提取出来，如果省略，即所有入口chunk都会被选择
   children: boolean,
   deepChildren: boolean,
   async: boolean|string,
}
```


---
title: "Vue transformAssetUrl解析"
date: 2023-04-30T16:28:50+08:00
draft: true
tags: ["vue3", "transformAssetUrl"]
categories: ["vue"]
---


# Vue transformAssetUrl源码解读



>  "version": "3.3.0-beta.2"



> packages\compiler-sfc\src\template\transformAssetUrl.ts





## createAssetUrlTransformWithOptions



入库函数返回一个闭包，符合一个插件的定义



```ts
export const createAssetUrlTransformWithOptions = (
  options: Required<AssetURLOptions>
): NodeTransform => {
  return (node, context) =>
    (transformAssetUrl as Function)(node, context, options)
}
```



## transformAssetUrl



目标函数是在转化前把引入资源的相对路径转化成变量引入的形式

> import xx from '..../xxx'



```ts

 // Before
 createVNode('img', { src: './logo.png' })
 
 // After
 import _imports_0 from './logo.png'
 createVNode('img', { src: _imports_0 })
```





### 1.所有资源都是html标签节点



> if (node.type === NodeTypes.ELEMENT) 



### 2.资源的标签属性是正确的需要资源引入属性



>   const tags = options.tags || defaultAssetUrlOptions.tags
>
>   const attrs = tags[node.tag]
>
>   const wildCardAttrs = tags['*']
>
>   if (!attrs && !wildCardAttrs) {
>
> ​     return
>
>   }



**遍历node节点的属性，对目标节点的属性进行判断**



### 3.如果提供了路径的base属性，并且设置的是相当路径

这里不去做替换成import的形式，直接把值覆盖成绝对路径

```ts
const url = parseUrl(attr.value.content)
// 不去增加import
if (options.base && attr.value.content[0] === '.') {
    // explicit base - directly rewrite relative urls into absolute url
    // to avoid generating extra imports
    // Allow for full hostnames provided in options.base
    const base = parseUrl(options.base)
    const protocol = base.protocol || ''
    // protocol + host + path的最终形式
    const host = base.host ? protocol + '//' + base.host : ''
    const basePath = base.path || '/'

    // when packaged in the browser, path will be using the posix-
    // only version provided by rollup-plugin-node-builtins.
    // 直接覆盖原值
    attr.value.content =
      host +
      (path.posix || path).join(basePath, url.path + (url.hash || ''))
    return
}
```



### 4.创建最终的`import`属性



这里会把原节点位置替换成`import`值形式

```ts
const exp = getImportsExpressionExp(url.path, url.hash, attr.loc, context)

node.props[index] = {
    type: NodeTypes.DIRECTIVE,
    name: 'bind',
    arg: createSimpleExpression(attr.name, true, attr.loc),
    exp,
    modifiers: [],
    loc: attr.loc
}
```



## getImportsExpressionExp生成import值



如果当前存在引入，则不再去引入了，否则生成新的引入语句



```ts
const existingIndex = context.imports.findIndex(i => i.path === path)
if (existingIndex > -1) {
  name = `_imports_${existingIndex}`
  exp = context.imports[existingIndex].exp as SimpleExpressionNode
} else {
  name = `_imports_${context.imports.length}`
  exp = createSimpleExpression(
    name,
    false,
    loc,
    ConstantTypes.CAN_STRINGIFY
  )
  context.imports.push({ exp, path })
}
```



如果存在hash并且不需要提示镜头变量的， 直接返回生成的对象



```ts
const hashExp = `${name} + '${hash}'`
const finalExp = createSimpleExpression(
  hashExp,
  false,
  loc,
  ConstantTypes.CAN_STRINGIFY
)

if (!context.hoistStatic) {
  return finalExp
}

```



如果需要静态提升的情况，先查询有没有提升的记录



```ts
const existingHoistIndex = context.hoists.findIndex(h => {
  return (
    h &&
    h.type === NodeTypes.SIMPLE_EXPRESSION &&
    !h.isStatic &&
    h.content === hashExp
  )
})
if (existingHoistIndex > -1) {
  return createSimpleExpression(
    `_hoisted_${existingHoistIndex + 1}`,
    false,
    loc,
    ConstantTypes.CAN_STRINGIFY
  )
}

return context.hoist(finalExp)
```


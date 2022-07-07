---
title: "vue3 -- @vue/compiler-core parse处理整体流程"
date: 2022-07-05T06:29:01+08:00
tags: ["vue3", "@vue/compiler-sfc"]
categories: ["vue"]
draft: false
---



# @vue/compiler-core



>   "version": "3.2.37"



> packages/compiler-core/src/parse.ts



## baseParse





### parseChildren



parseChildren采用了一种从前向后匹配的机制，不断的去改写`context.source`上的字符串

其中parseChildren是处理核心，最终parseElement也会走回到这里，逻辑有点像vue patch的处理逻辑



![parse (1).png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c43c0f7e8be442cd9980c070d4eef931~tplv-k3u1fbpfcp-watermark.image?)





## parseInterpolation



解析插值操作



```typescript
function parseInterpolation(
  context: ParserContext,
  mode: TextModes
): InterpolationNode | undefined {
  // 拿到插值表达式的开始符和结束符
  const [open, close] = context.options.delimiters

  // 除去开始符，开始计算结束符的索引
  const closeIndex = context.source.indexOf(close, open.length)
  // 索引是-1，说明没有结束符，报错
  if (closeIndex === -1) {
    emitError(context, ErrorCodes.X_MISSING_INTERPOLATION_END)
    return undefined
  }

  // 拿到当前上下文的开始位置，这是包括开始符和结束符的
  const start = getCursor(context)
  // 修改source 字符串，从头删除 开始符长度
  advanceBy(context, open.length)
  // 储存常量，开始符和结束符的位置，这个时候开始符和结束符的位置是一致的
  const innerStart = getCursor(context)
  const innerEnd = getCursor(context)
  // 计算出开始符和结束符直接的字符长度
  const rawContentLength = closeIndex - open.length
  // 截取出对应长度，其实就是插值表达式了
  const rawContent = context.source.slice(0, rawContentLength)
  // 解析出整个插值表达式的字符串，并且修改source上的剩余字符串
  const preTrimContent = parseTextData(context, rawContentLength, mode)
  // 字符串trim
  const content = preTrimContent.trim()
  // 开头的偏移量， 说明有空格
  const startOffset = preTrimContent.indexOf(content)
  if (startOffset > 0) {
    // 修改innerStart上的对应偏移参数
    advancePositionWithMutation(innerStart, rawContent, startOffset)
  }
  // 计算出结尾的偏移量
  const endOffset =
    rawContentLength - (preTrimContent.length - content.length - startOffset)
  // 对应修改innerEnd上的对应偏移参数
  advancePositionWithMutation(innerEnd, rawContent, endOffset)
  // 同时修改source上的字符串，去除尾部标签长度的字符串
  advanceBy(context, close.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      isStatic: false,
      // Set `isConstant` to false by default and will decide in transformExpression
      constType: ConstantTypes.NOT_CONSTANT,
      content,
      loc: getSelection(context, innerStart, innerEnd)
    },
    loc: getSelection(context, start)
  }
}
```






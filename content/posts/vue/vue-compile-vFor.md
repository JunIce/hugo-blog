---
title: "Vue -- VFor的编译处理"
date: 2022-08-04T15:52:38+08:00
tags: ["vue3"]
categories: ["vue"]
draft: false
---







# vue -- VFor的编译处理



>  "version": "3.2.37"



### createStructuralDirectiveTransform

通用函数， 根据模板创建指令数据，匹配对应的名字或者正则

```typescript
export function createStructuralDirectiveTransform(
  name: string | RegExp,
  fn: StructuralDirectiveTransform
): NodeTransform {
  // 闭包函数，返回一个匹配函数
  const matches = isString(name)
    ? (n: string) => n === name
    : (n: string) => name.test(n)

  return (node, context) => {
    // node是元素节点
    if (node.type === NodeTypes.ELEMENT) {
      const { props } = node
      // structural directive transforms are not concerned with slots
      // as they are handled separately in vSlot.ts
      if (node.tagType === ElementTypes.TEMPLATE && props.some(isVSlot)) {
        return
      }
      // 遍历props
      const exitFns = []
      for (let i = 0; i < props.length; i++) {
        const prop = props[i]
        // 如果props的类型是指令，并且能够匹配到
        if (prop.type === NodeTypes.DIRECTIVE && matches(prop.name)) {
          // 在执行之前删除指定的指令，防止递归执行，移动相关的节点
          props.splice(i, 1)
          i--
          // 收集退出函数
          const onExit = fn(node, prop, context)
          if (onExit) exitFns.push(onExit)
        }
      }
      // 最终返回退出函数的队列
      return exitFns
    }
  }
}

```



## processFor



处理for语句的相关代码







### parseForExpression

解析for语句相关的代码

```typescript
export function parseForExpression(
  input: SimpleExpressionNode,
  context: TransformContext
): ForParseResult | undefined {
  // 代码位置
  const loc = input.loc
  const exp = input.content
  // 根据template中for语句的代码正则匹配
  const inMatch = exp.match(forAliasRE)
  if (!inMatch) return
  // 拿到in/of左右两边的值
  const [, LHS, RHS] = inMatch

  // 创建出for语句返回结果
  const result: ForParseResult = {
    // 拿到左右两边的位置信息
    source: createAliasExpression(
      loc,
      RHS.trim(),
      exp.indexOf(RHS, LHS.length)
    ),
    value: undefined,
    key: undefined,
    index: undefined
  }
  if (!__BROWSER__ && context.prefixIdentifiers) {
    result.source = processExpression(
      result.source as SimpleExpressionNode,
      context
    )
  }


  let valueContent = LHS.trim().replace(stripParensRE, '').trim()
  const trimmedOffset = LHS.indexOf(valueContent)

  // 是否存在迭代相关的代码
  const iteratorMatch = valueContent.match(forIteratorRE)
  if (iteratorMatch) {
    valueContent = valueContent.replace(forIteratorRE, '').trim()

    const keyContent = iteratorMatch[1].trim()
    let keyOffset: number | undefined
    if (keyContent) {
      keyOffset = exp.indexOf(keyContent, trimmedOffset + valueContent.length)
      result.key = createAliasExpression(loc, keyContent, keyOffset)
      if (!__BROWSER__ && context.prefixIdentifiers) {
        result.key = processExpression(result.key, context, true)
      }
    }

    if (iteratorMatch[2]) {
      const indexContent = iteratorMatch[2].trim()

      if (indexContent) {
        result.index = createAliasExpression(
          loc,
          indexContent,
          exp.indexOf(
            indexContent,
            result.key
              ? keyOffset! + keyContent.length
              : trimmedOffset + valueContent.length
          )
        )
        if (!__BROWSER__ && context.prefixIdentifiers) {
          result.index = processExpression(result.index, context, true)
        }
        if (__DEV__ && __BROWSER__) {
          validateBrowserExpression(
            result.index as SimpleExpressionNode,
            context,
            true
          )
        }
      }
    }
  }

  if (valueContent) {
    result.value = createAliasExpression(loc, valueContent, trimmedOffset)
    if (!__BROWSER__ && context.prefixIdentifiers) {
      result.value = processExpression(result.value, context, true)
    }
  }
 
  return result
}
```




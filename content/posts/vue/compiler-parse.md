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



baseParse的主要作用就是把vue sfc中的template模板，解析编译成一个树形对象，最终会把这个树形结构转化成对应的js对象



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



## parseTag



解析字符串中的html标签



```typescript
function parseTag(
  context: ParserContext,
  type: TagType,
  parent: ElementNode | undefined
): ElementNode | undefined {
 

  // Tag open.
  const start = getCursor(context)
  // 正则匹配标签名
  const match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source)!
  // 拿到当前的标签名
  const tag = match[1]
  const ns = context.options.getNamespace(tag, parent)

  // 删除标签名长度的字符串
  advanceBy(context, match[0].length)
  // 去除source上的空白符
  advanceSpaces(context)

  // save current state in case we need to re-parse attributes with v-pre
  // 保存当前的坐标
  const cursor = getCursor(context)
  // 当前source备份
  const currentSource = context.source

  // check <pre> tag
  // 是否是pre标签
  if (context.options.isPreTag(tag)) {
    context.inPre = true
  }

  // Attributes.
  // 解析出标签的属性
  let props = parseAttributes(context, type)

  // check v-pre
  // 是否含有v-pre属性
  if (
    type === TagType.Start &&
    !context.inVPre &&
    props.some(p => p.type === NodeTypes.DIRECTIVE && p.name === 'pre')
  ) {
    context.inVPre = true
    // reset context
    // 恢复备份，重置source的值， 过滤出没有v-pre的属性
    extend(context, cursor)
    context.source = currentSource
    // re-parse attrs and filter out v-pre itself
    props = parseAttributes(context, type).filter(p => p.name !== 'v-pre')
  }

  // Tag close.
  // 是否是自闭合标签
  let isSelfClosing = false
  if (context.source.length === 0) {
    emitError(context, ErrorCodes.EOF_IN_TAG)
  } else {
    // 当前剩余字符串如果是已/>开头，说明是自闭合标签
    isSelfClosing = startsWith(context.source, '/>')
    if (type === TagType.End && isSelfClosing) {
      emitError(context, ErrorCodes.END_TAG_WITH_TRAILING_SOLIDUS)
    }
    // 自闭合标签，就删除2个字符，否则删除一个字符
    advanceBy(context, isSelfClosing ? 2 : 1)
  }

  if (type === TagType.End) {
    return
  }

  // 2.x deprecation checks
  // vue2语法的兼容
  if (
    __COMPAT__ &&
    __DEV__ &&
    isCompatEnabled(
      CompilerDeprecationTypes.COMPILER_V_IF_V_FOR_PRECEDENCE,
      context
    )
  ) {
    let hasIf = false
    let hasFor = false
    // 属性中是否含有if或者for， 即v-if 或者v-for
    for (let i = 0; i < props.length; i++) {
      const p = props[i]
      if (p.type === NodeTypes.DIRECTIVE) {
        if (p.name === 'if') {
          hasIf = true
        } else if (p.name === 'for') {
          hasFor = true
        }
      }
      if (hasIf && hasFor) {
        warnDeprecation(
          CompilerDeprecationTypes.COMPILER_V_IF_V_FOR_PRECEDENCE,
          context,
          getSelection(context, start)
        )
        break
      }
    }
  }
  // 标签类型， 判断出是否是元素标签，slot，template, 还是组件
  let tagType = ElementTypes.ELEMENT
  if (!context.inVPre) {
    if (tag === 'slot') {
      tagType = ElementTypes.SLOT
    } else if (tag === 'template') {
      if (
        props.some(
          p =>
            p.type === NodeTypes.DIRECTIVE && isSpecialTemplateDirective(p.name)
        )
      ) {
        tagType = ElementTypes.TEMPLATE
      }
    } else if (isComponent(tag, props, context)) {
      tagType = ElementTypes.COMPONENT
    }
  }

  return {
    type: NodeTypes.ELEMENT,
    ns,
    tag,
    tagType,
    props,
    isSelfClosing,
    children: [],
    loc: getSelection(context, start),
    codegenNode: undefined // to be created during transform phase
  }
}
```



## parseAttributes



解析标签上的属性



### parseAttributes



```typescript
function parseAttributes(
  context: ParserContext,
  type: TagType
): (AttributeNode | DirectiveNode)[] {
  const props = []
  // 标签名的集合
  const attributeNames = new Set<string>()
  
  // 由开头开始遍历
  while (
    context.source.length > 0 &&
    !startsWith(context.source, '>') &&
    !startsWith(context.source, '/>')
  ) {
    if (startsWith(context.source, '/')) {
      emitError(context, ErrorCodes.UNEXPECTED_SOLIDUS_IN_TAG)
      advanceBy(context, 1)
      advanceSpaces(context)
      continue
    }
    if (type === TagType.End) {
      emitError(context, ErrorCodes.END_TAG_WITH_ATTRIBUTES)
    }
	
    // 拿到当前的属性
    const attr = parseAttribute(context, attributeNames)

    // Trim whitespace between class
    // https://github.com/vuejs/core/issues/4251
    // 删除class属性的空格
    if (
      attr.type === NodeTypes.ATTRIBUTE &&
      attr.value &&
      attr.name === 'class'
    ) {
      attr.value.content = attr.value.content.replace(/\s+/g, ' ').trim()
    }
	// 属性容器添加
    if (type === TagType.Start) {
      props.push(attr)
    }

    if (/^[^\t\r\n\f />]/.test(context.source)) {
      emitError(context, ErrorCodes.MISSING_WHITESPACE_BETWEEN_ATTRIBUTES)
    }
    // 删除空格
    advanceSpaces(context)
  }
  return props
}

```



### parseAttribute



解析属性的键值对



```typescript
function parseAttribute(
  context: ParserContext,
  nameSet: Set<string>
): AttributeNode | DirectiveNode {
  __TEST__ && assert(/^[^\t\r\n\f />]/.test(context.source))

  // Name.
  // 解析出标签名
  const start = getCursor(context)
  // 匹配出=号之前的字符串
  const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source)!
  // 拿到属性名
  const name = match[0]

  // 属性名如果重复，报错
  if (nameSet.has(name)) {
    emitError(context, ErrorCodes.DUPLICATE_ATTRIBUTE)
  }
  // 添加
  nameSet.add(name)

  if (name[0] === '=') {
    emitError(context, ErrorCodes.UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME)
  }
  {
    const pattern = /["'<]/g
    let m: RegExpExecArray | null
    while ((m = pattern.exec(name))) {
      emitError(
        context,
        ErrorCodes.UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME,
        m.index
      )
    }
  }

  // 删除字符串属性名长度的字符
  advanceBy(context, name.length)

  // Value
  // 值
  let value: AttributeValue = undefined
  // 
  if (/^[\t\r\n\f ]*=/.test(context.source)) {
    // 删除等号之前的空格
    advanceSpaces(context)
    // 删除等号
    advanceBy(context, 1)
    // 删除等号之后的空格
    advanceSpaces(context)
    // 解析出具体的值对象
    value = parseAttributeValue(context)
    if (!value) {
      emitError(context, ErrorCodes.MISSING_ATTRIBUTE_VALUE)
    }
  }
  // 开始位置
  const loc = getSelection(context, start)
  // 如果不是v-pre，并且	以v-开头的属性
  if (!context.inVPre && /^(v-[A-Za-z0-9-]|:|\.|@|#)/.test(name)) {
    const match =
      /(?:^v-([a-z0-9-]+))?(?:(?::|^\.|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i.exec(
        name
      )!

    let isPropShorthand = startsWith(name, '.')
    // 指令名称
    let dirName =
      match[1] ||
      (isPropShorthand || startsWith(name, ':')
        ? 'bind'
        // 已@符号开头
        : startsWith(name, '@')
        ? 'on'
        : 'slot')
    let arg: ExpressionNode | undefined

    if (match[2]) {
      // v-slot
      const isSlot = dirName === 'slot'
      // 从后向前查找索引
      const startOffset = name.lastIndexOf(match[2])
      // 位置
      const loc = getSelection(
        context,
        getNewPosition(context, start, startOffset),
        getNewPosition(
          context,
          start,
          startOffset + match[2].length + ((isSlot && match[3]) || '').length
        )
      )
      // 拿到值
      let content = match[2]
      let isStatic = true

      // 动态属性
      if (content.startsWith('[')) {
        isStatic = false

        if (!content.endsWith(']')) {
          emitError(
            context,
            ErrorCodes.X_MISSING_DYNAMIC_DIRECTIVE_ARGUMENT_END
          )
          content = content.slice(1)
        } else {
          content = content.slice(1, content.length - 1)
        }
      } else if (isSlot) {
        // #1241 special case for v-slot: vuetify relies extensively on slot
        // names containing dots. v-slot doesn't have any modifiers and Vue 2.x
        // supports such usage so we are keeping it consistent with 2.x.
        content += match[3] || ''
      }

      arg = {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content,
        isStatic,
        constType: isStatic
          ? ConstantTypes.CAN_STRINGIFY
          : ConstantTypes.NOT_CONSTANT,
        loc
      }
    }

    // 值有引号的情况
    if (value && value.isQuoted) {
      const valueLoc = value.loc
      // 偏移量指针后移，
      valueLoc.start.offset++
      valueLoc.start.column++
      valueLoc.end = advancePositionWithClone(valueLoc.start, value.content)
      // 从第一个位置开始取值到倒数第一位
      valueLoc.source = valueLoc.source.slice(1, -1)
    }

    // 修饰符列表
    const modifiers = match[3] ? match[3].slice(1).split('.') : []
    if (isPropShorthand) modifiers.push('prop')

    // 2.x compat v-bind:foo.sync -> v-model:foo
    if (__COMPAT__ && dirName === 'bind' && arg) {
      if (
        modifiers.includes('sync') &&
        checkCompatEnabled(
          CompilerDeprecationTypes.COMPILER_V_BIND_SYNC,
          context,
          loc,
          arg.loc.source
        )
      ) {
        dirName = 'model'
        modifiers.splice(modifiers.indexOf('sync'), 1)
      }

      if (__DEV__ && modifiers.includes('prop')) {
        checkCompatEnabled(
          CompilerDeprecationTypes.COMPILER_V_BIND_PROP,
          context,
          loc
        )
      }
    }

    return {
      type: NodeTypes.DIRECTIVE,
      name: dirName,
      exp: value && {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content: value.content,
        isStatic: false,
        // Treat as non-constant by default. This can be potentially set to
        // other values by `transformExpression` to make it eligible for hoisting.
        constType: ConstantTypes.NOT_CONSTANT,
        loc: value.loc
      },
      arg,
      modifiers,
      loc
    }
  }

  // missing directive name or illegal directive name
  if (!context.inVPre && startsWith(name, 'v-')) {
    emitError(context, ErrorCodes.X_MISSING_DIRECTIVE_NAME)
  }

  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value: value && {
      type: NodeTypes.TEXT,
      content: value.content,
      loc: value.loc
    },
    loc
  }
}

```



### parseAttributeValue



解析属性值



```typescript
function parseAttributeValue(context: ParserContext): AttributeValue {
  // 获取开头位置
  const start = getCursor(context)
  let content: string

  // 拿到第一个字符
  const quote = context.source[0]
  const isQuoted = quote === `"` || quote === `'`
  if (isQuoted) {
    // Quoted value.
    // 带引号的值，去除一位
    advanceBy(context, 1)

    // 尾部索引
    const endIndex = context.source.indexOf(quote)
    if (endIndex === -1) {
      content = parseTextData(
        context,
        context.source.length,
        TextModes.ATTRIBUTE_VALUE
      )
    } else {
      content = parseTextData(context, endIndex, TextModes.ATTRIBUTE_VALUE)
      // 去除尾部一个字符
      advanceBy(context, 1)
    }
  } else {
    // Unquoted
    const match = /^[^\t\r\n\f >]+/.exec(context.source)
    if (!match) {
      return undefined
    }
    const unexpectedChars = /["'<=`]/g
    let m: RegExpExecArray | null
    while ((m = unexpectedChars.exec(match[0]))) {
      emitError(
        context,
        ErrorCodes.UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE,
        m.index
      )
    }
    content = parseTextData(context, match[0].length, TextModes.ATTRIBUTE_VALUE)
  }

  // 返回一个对象
  return { content, isQuoted, loc: getSelection(context, start) }
}
```





## parseText



解析纯文本字符串



```typescript
function parseText(context: ParserContext, mode: TextModes): TextNode {

  // 构建解析文本字符串的结束集合， 其中 < 表示标签的开始符， delimiters[0]表示插值的开始位置
  const endTokens =
    mode === TextModes.CDATA ? [']]>'] : ['<', context.options.delimiters[0]]
 // 假定是整个字符串的长度
  let endIndex = context.source.length
  for (let i = 0; i < endTokens.length; i++) {
    // 分别从下标1的位置开始向后查找，直到找到最近的匹配索引
    const index = context.source.indexOf(endTokens[i], 1)
    if (index !== -1 && endIndex > index) {
      // 找到最短的字符位置
      endIndex = index
    }
  }

  // .... code

  // 开始位置
  const start = getCursor(context)
  // 根据最后的下标位置进行截取，并且更改原字符串
  const content = parseTextData(context, endIndex, mode)

  // 构造成最终对象
  return {
    type: NodeTypes.TEXT,
    content,
    loc: getSelection(context, start)
  }
}
```



### parseTextData



解析文本数据



```typescript
function parseTextData(
  context: ParserContext,
  length: number,
  mode: TextModes
): string {
  // 文本原始值
  const rawText = context.source.slice(0, length)
  // 删除到source上对应的长度
  advanceBy(context, length)
  if (
    mode === TextModes.RAWTEXT ||
    mode === TextModes.CDATA ||
    !rawText.includes('&')
  ) {
    return rawText
  } else {
    // DATA or RCDATA containing "&"". Entity decoding required.
    // 如果包含&,就会当成值去解析
    return context.options.decodeEntities(
      rawText,
      mode === TextModes.ATTRIBUTE_VALUE
    )
  }
}
```




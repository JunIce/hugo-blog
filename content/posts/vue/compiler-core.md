---
title: "vue -- @vue/compiler-core整体逻辑"
date: 2023-05-15T15:26:32+08:00
tags: ["vue3", "@vue/compiler-core"]
categories: ["vue"]
draft: false
---





# vue  @vue/compiler-core整体逻辑



>  "version": "3.3.2"



`@vue/compiler-core`主要处理的是`@vue/compiler-sfc`模版部分，最终处理成`render`函数



其中主要对外暴露的有以下几个api

- baseCompile
- baseParse
- transform
- generate



## baseParse



`baseParse`主要处理是**sfc**中模版的部分（`html`部分），我们在写模版部分的时候，会写很多插值、指令、组件等等之类的

`baseParse`处理之后的结果是把模版处理成**ast**对象



比如

```js
'{{ a<b }}'
```

会处理成

```ts
{
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: `a<b`,
      isStatic: false,
      constType: ConstantTypes.NOT_CONSTANT,
      loc: {
        start: { offset: 3, line: 1, column: 4 },
        end: { offset: 6, line: 1, column: 7 },
        source: 'a<b'
      }
    },
    loc: {
      start: { offset: 0, line: 1, column: 1 },
      end: { offset: 9, line: 1, column: 10 },
      source: '{{ a<b }}'
    }
}
```



- type

  其中每个节点Node都会有个type，type的不同代表不同的类型

  每个类型最终在生成代码时，会进行不同的操作

- loc

  代表当前字符在原字符中的位置



#### 节点类型

内置以下不同的节点类型

```ts
enum NodeTypes {
  ROOT,
  ELEMENT,
  TEXT,
  COMMENT,
  SIMPLE_EXPRESSION,
  INTERPOLATION,
  ATTRIBUTE,
  DIRECTIVE,
  // containers
  COMPOUND_EXPRESSION,
  IF,
  IF_BRANCH,
  FOR,
  TEXT_CALL,
  // codegen
  VNODE_CALL,
  JS_CALL_EXPRESSION,
  JS_OBJECT_EXPRESSION,
  JS_PROPERTY,
  JS_ARRAY_EXPRESSION,
  JS_FUNCTION_EXPRESSION,
  JS_CONDITIONAL_EXPRESSION,
  JS_CACHE_EXPRESSION,

  // ssr codegen
  JS_BLOCK_STATEMENT,
  JS_TEMPLATE_LITERAL,
  JS_IF_STATEMENT,
  JS_ASSIGNMENT_EXPRESSION,
  JS_SEQUENCE_EXPRESSION,
  JS_RETURN_STATEMENT
}
```



## transform



`transform`的主要作用就是转化`ast`中我们写的一些特殊的语法，比如说 `v-for`、`v-if`、`slot`等等



这里传入的是上面编译过后的`ast`

第二个参数是系统内置的一些转换器和指令转换器

```ts
 transform(
    ast,
    extend({}, options, {
      prefixIdentifiers,
      nodeTransforms: [
        ...nodeTransforms,
        ...(options.nodeTransforms || []) // user transforms
      ],
      directiveTransforms: extend(
        {},
        directiveTransforms,
        options.directiveTransforms || {} // user transforms
      )
    })
  )
```



包括以下内置转换器

```ts
[
    [
      transformOnce,
      transformIf,
      transformMemo,
      transformFor,
      ...(__COMPAT__ ? [transformFilter] : []),
      ...(!__BROWSER__ && prefixIdentifiers
        ? [
            // order is important
            trackVForSlotScopes,
            transformExpression
          ]
        : __BROWSER__ && __DEV__
        ? [transformExpression]
        : []),
      transformSlotOutlet,
      transformElement,
      trackSlotScopes,
      transformText
    ],
    {
      on: transformOn,
      bind: transformBind,
      model: transformModel
    }
  ]
```



对`ast`的操作其实就是递归处理， 根据上面`compile`的结果，每个节点其实都有不同的type，识别出不同的type，就可以对ast对象进行处理



编译的主要核心就是在`transform`这一块，这一块可以对最终生成的模板进行定制



## generate



`generate`就是生成的意思



这里传入上面处理`transform`过的`ast`结果

```ts
generate(
    ast,
    extend({}, options, {
      prefixIdentifiers
    })
)
```





这里就是生成对应的`render`函数代码

```js
return function render(_ctx, _cache) {
  with (_ctx) {
    return _createElementVNode(\\"div\\", {
      id: \\"foo\\",
      [prop]: bar,
      [foo + bar]: bar
    }, [
      _createElementVNode(\\"p\\", { \\"some-key\\": \\"foo\\" })
    ], 16)
  }
}
```



#### genNode

会进行递归调用，组装改节点类型的`type`，最终拼装成`render`执行的`js`函数



## baseCompile



baseCompile就是一个组装函数，内部执行了上面3个函数

- baseParse
- transform
- generate

最终返回编译后的render函数






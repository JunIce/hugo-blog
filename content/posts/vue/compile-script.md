---
title: "vue3 -- @vue/compiler-sfc compileScript源码"
date: 2023-04-28T06:29:01+08:00
tags: ["vue3", "@vue/compiler-sfc", "compileScript"]
categories: ["vue"]
draft: false
type: "vue"
---





# vue3 -- @vue/compiler-sfc compileScript源码



>   "version": "3.3.0-beta.2"



`compileScript`函数在解析sfc文件时，起着关键作用，最终会把我们在sfc文件中定义的script代码快组合到一起，成为vue的组件定义的js结构



本章的学习目标，看compileScript如何实现script中setup函数体的导出功能



也就是以下定义

```vue
<script setup>
      import { ref } from 'vue'
      defineProps(['foo'])
      defineEmits(['bar'])
      const r = ref(0)
</script>
```

最终会实现成

```vue
<script>
import { ref } from 'vue'
export default {
    props: {
        foo: any 
    },
    emits: ['bar'],
    setup(props, ctx) {
      const r = ref(0)
      return {
          r
      }
    }
}
</script>
```





>  packages/compiler-sfc/src/compileScript.ts

## compileScript



### 1. 定义script解析上下文



```ts
  const ctx = new ScriptCompileContext(sfc, options)
```



`ScriptCompileContext`对象实例时，会对`script`部分代码进行`babel`转译，最终获取到编译结果的`ast`

```ts
class ScriptCompileContext{
    constructor(
    public descriptor: SFCDescriptor,
    public options: Partial<SFCScriptCompileOptions>
  ) {
	// ....
	// 判断是js还是ts
    // ...
    // resolve parser plugins
    const plugins: ParserPlugin[] = resolveParserPlugins(
      (scriptLang || scriptSetupLang)!,
      options.babelParserPlugins
    )
	
    // 获取ast
    function parse(input: string, offset: number): Program {
        return babelParse(input, {
          plugins,
          sourceType: 'module'
        }).program
      
    }
	
    this.scriptAst =
      descriptor.script &&
      parse(descriptor.script.content, descriptor.script.loc.start.offset)

    this.scriptSetupAst =
      descriptor.scriptSetup &&
      parse(descriptor.scriptSetup!.content, this.startOffset!)
  }
}
```



这里会拿到2中ast

- scriptAst
- scriptSetupAst

后续操作都是围绕这2个ast结果



### 1.1 scriptAst

遍历ast中引用的部分，也就是我们使用`import`导入的部分， 最终会在`registerUserImport`函数中挂载到`ctx.userImports`对象上

```ts
// 1.1 walk import delcarations of <script>
  if (scriptAst) {
    for (const node of scriptAst.body) {
      if (node.type === 'ImportDeclaration') {
        // record imports for dedupe
        for (const specifier of node.specifiers) {
          const imported = getImportedName(specifier)
          registerUserImport(
            node.source.value,
            specifier.local.name,
            imported,
            node.importKind === 'type' ||
              (specifier.type === 'ImportSpecifier' &&
                specifier.importKind === 'type'),
            false,
            !options.inlineTemplate
          )
        }
      }
    }
  }
```



### 1.2 scriptSetupAst

同样的操作把导入挂到`ctx.userImports`对象上



### 1.3  有关vue相关的导入

这里可能有对vue的导入函数进行重命名的，进行了缓存，存储到`vueImportAliases`对象上



### 2.1 处理`<script>`主体部分



```ts
for (const node of scriptAst.body) {
      // 处理 export default
      if (node.type === 'ExportDefaultDeclaration') {
        // export default 代码
        defaultExport = node
		// .... code
          
      } else if (node.type === 'ExportNamedDeclaration') {
          // 处理 export const xxx 代码
          // .... code
      } else if (
        (node.type === 'VariableDeclaration' ||
          node.type === 'FunctionDeclaration' ||
          node.type === 'ClassDeclaration' ||
          node.type === 'TSEnumDeclaration') &&
        !node.declare
      ) {
        // 处理变量定义、函数定义、class定义，ts 枚举定义
        // ....code
      }
    }

```



这块处理了有关script中对于`$ref`等变量的解构值的处理，也就是在后续代码中不需要写`.value`取值,这里明确写了`3.4`会去掉这个

```ts
// apply reactivity transform
// TODO remove in 3.4
if (enableReactivityTransform && shouldTransform(script.content)) {
  const { rootRefs, importedHelpers } = transformAST(
    scriptAst,
    ctx.s,
    scriptStartOffset!
  )
  refBindings = rootRefs
  for (const h of importedHelpers) {
    ctx.helperImports.add(h)
  }
}
```





如果定义的script在setup定义下面，这里还把script定义进行提示到定义上面，防止有些setup中引用了script中的定义

```ts
// <script> after <script setup>
// we need to move the block up so that `const __default__` is
// declared before being used in the actual component definition
if (scriptStartOffset! > startOffset) {
  // if content doesn't end with newline, add one
  if (!/\n$/.test(script.content.trim())) {
    ctx.s.appendLeft(scriptEndOffset!, `\n`)
  }
  ctx.s.move(scriptStartOffset!, scriptEndOffset!, 0)
}
```



### 2.2 处理setup代码块

```ts
for (const node of scriptSetupAst.body) {
  // 处理表达式定义
    if (node.type === 'ExpressionStatement') {
      /**
       * 包括 defineProps
       * defineEmits
       * defineOptions
       * defineSlots
       * defineModel
       */
      // ...code
    }

    // 处理变量定义
    if (node.type === 'VariableDeclaration' && !node.declare) {
      // ...code
    }

    let isAllLiteral = false
    // walk declarations to record declared bindings
    // 处理变量定义、函数定义、class定义，ts 枚举定义
    if (
      (node.type === 'VariableDeclaration' ||
        node.type === 'FunctionDeclaration' ||
        node.type === 'ClassDeclaration' ||
        node.type === 'TSEnumDeclaration') &&
      !node.declare
    ) {
      // ....
    }

    // hoist literal constants
    if (hoistStatic && isAllLiteral) {
      hoistNode(node)
    }

    // walk statements & named exports / variable declarations for top level
    // await
    if (
      (node.type === 'VariableDeclaration' && !node.declare) ||
      node.type.endsWith('Statement')
    ) {
      const scope: Statement[][] = [scriptSetupAst.body]
      // 递归节点
      ;(walk as any)(node, {
        enter(child: Node, parent: Node) {
          // 函数跳过
          if (isFunctionType(child)) {
            this.skip()
          }
          // 块级声明
          if (child.type === 'BlockStatement') {
            scope.push(child.body)
          }
          // await函数
          if (child.type === 'AwaitExpression') {
          //  处理await
            processAwait(
              // ...
            )
          }
        },
        exit(node: Node) {
          if (node.type === 'BlockStatement') scope.pop()
        }
      })
    }

    if (ctx.isTS) {
      // move all Type declarations to outer scope
      // 删除声明
      if (
        node.type.startsWith('TS') ||
        (node.type === 'ExportNamedDeclaration' &&
          node.exportKind === 'type') ||
        (node.type === 'VariableDeclaration' && node.declare)
      ) {
        if (node.type !== 'TSEnumDeclaration') {
          hoistNode(node)
        }
      }
    }
  }
```





### 3. 处理props解构

```ts
 if (ctx.propsDestructureDecl) {
    transformDestructuredProps(ctx, vueImportAliases)
  }
```



### 4.处理setup中对于响应式转换

```ts
 if (
    enableReactivityTransform &&
    // normal <script> had ref bindings that maybe used in <script setup>
    (refBindings || shouldTransform(scriptSetup.content))
  ) {
    const { rootRefs, importedHelpers } = transformAST(
      scriptSetupAst,
      ctx.s,
      startOffset,
      refBindings
    )
    refBindings = refBindings ? [...refBindings, ...rootRefs] : rootRefs
    for (const h of importedHelpers) {
      ctx.helperImports.add(h)
    }
  }

```





### 5.检查参数

check macro args to make sure it doesn't reference setup scope

检查宏参数以确保它没有引用setup作用域

```ts
  checkInvalidScopeReference(ctx.propsRuntimeDecl, DEFINE_PROPS)
  checkInvalidScopeReference(ctx.propsRuntimeDefaults, DEFINE_PROPS)
  checkInvalidScopeReference(ctx.propsDestructureDecl, DEFINE_PROPS)
  checkInvalidScopeReference(ctx.emitsRuntimeDecl, DEFINE_EMITS)
  checkInvalidScopeReference(ctx.optionsRuntimeDecl, DEFINE_OPTIONS)
```



### 6.删除空白部分

删除代码中 script标签中两边的空白字符

```ts
if (script) {
    if (startOffset < scriptStartOffset!) {
      // <script setup> before <script>
      ctx.s.remove(0, startOffset)
      ctx.s.remove(endOffset, scriptStartOffset!)
      ctx.s.remove(scriptEndOffset!, source.length)
    } else {
      // <script> before <script setup>
      ctx.s.remove(0, scriptStartOffset!)
      ctx.s.remove(scriptEndOffset!, startOffset)
      ctx.s.remove(endOffset, source.length)
    }
  } else {
    // only <script setup>
    ctx.s.remove(0, startOffset)
    ctx.s.remove(endOffset, source.length)
  }
```





### 7.分析绑定元数据

```ts
if (scriptAst) {
    Object.assign(ctx.bindingMetadata, analyzeScriptBindings(scriptAst.body))
  }
  for (const [key, { isType, imported, source }] of Object.entries(
    ctx.userImports
  )) {
    if (isType) continue
    ctx.bindingMetadata[key] =
      imported === '*' ||
      (imported === 'default' && source.endsWith('.vue')) ||
      source === 'vue'
        ? BindingTypes.SETUP_CONST
        : BindingTypes.SETUP_MAYBE_REF
  }
  for (const key in scriptBindings) {
    ctx.bindingMetadata[key] = scriptBindings[key]
  }
  for (const key in setupBindings) {
    ctx.bindingMetadata[key] = setupBindings[key]
  }
  // known ref bindings
  if (refBindings) {
    for (const key of refBindings) {
      ctx.bindingMetadata[key] = BindingTypes.SETUP_REF
    }
  }
```





### 8.处理css中绑定变量



```ts
if (
    sfc.cssVars.length &&
    // no need to do this when targeting SSR
    !(options.inlineTemplate && options.templateOptions?.ssr)
  ) {
    ctx.helperImports.add(CSS_VARS_HELPER)
    ctx.helperImports.add('unref')
    ctx.s.prependLeft(
      startOffset,
      `\n${genCssVarsCode(
        sfc.cssVars,
        ctx.bindingMetadata,
        scopeId,
        !!options.isProd
      )}\n`
    )
  }
```



### 9.处理script中的setup函数



#### 9.1处理props定义声明

标记为任何且仅在分配时使用
因为用户定义的复杂类型可能与从生成的运行时声明中推断的类型不兼容

这个args在后面组装最终返回的时候使用

```ts
let args = `__props`
if (ctx.propsTypeDecl) {
    // mark as any and only cast on assignment
    // since the user defined complex types may be incompatible with the
    // inferred type from generated runtime declarations
    args += `: any`
}
```



#### 9.2插入props重命名

```ts
  if (ctx.propsIdentifier) {
    ctx.s.prependLeft(
      startOffset,
      `\nconst ${ctx.propsIdentifier} = __props;\n`
    )
  }
```





#### 9.3 props解构，插入到字符顶部

```ts
if (ctx.propsDestructureRestId) {
    ctx.s.prependLeft(
      startOffset,
      `\nconst ${ctx.propsDestructureRestId} = ${ctx.helper(
        `createPropsRestProxy`
      )}(__props, ${JSON.stringify(
        Object.keys(ctx.propsDestructuredBindings)
      )});\n`
    )
  }
```



#### 9.4 处理await函数体

```ts
  // inject temp variables for async context preservation
  if (hasAwait) {
    const any = ctx.isTS ? `: any` : ``
    ctx.s.prependLeft(startOffset, `\nlet __temp${any}, __restore${any}\n`)
  }
```



#### 9.5处理emit和expose函数

```ts
  const destructureElements =
    ctx.hasDefineExposeCall || !options.inlineTemplate
      ? [`expose: __expose`]
      : []
  if (ctx.emitIdentifier) {
    destructureElements.push(
      ctx.emitIdentifier === `emit` ? `emit` : `emit: ${ctx.emitIdentifier}`
    )
  }
  if (destructureElements.length) {
    args += `, { ${destructureElements.join(', ')} }`
  }
```



### 10. 组装script 和 script setup返回



#### 非行内模版或者不存在模版且有默认返回的情况下

##### 10.1 绑定变量合并

所有的绑定变量进行合并，用了对象解构，script在前，setup在后

优先级就是setup中的更优先

如果有引入，引入的变量定义为true

```ts
const allBindings: Record<string, any> = {
    ...scriptBindings,
    ...setupBindings
  }
  for (const key in ctx.userImports) {
    if (
      !ctx.userImports[key].isType &&
      ctx.userImports[key].isUsedInTemplate
    ) {
      allBindings[key] = true
    }
  }
```



遍历绑定对象进行字符组装

```ts
returned = `{ `
  for (const key in allBindings) {
    if (
      allBindings[key] === true &&
      ctx.userImports[key].source !== 'vue' &&
      !ctx.userImports[key].source.endsWith('.vue')
    ) {
      // generate getter for import bindings
      // skip vue imports since we know they will never change
      returned += `get ${key}() { return ${key} }, `
    } else if (ctx.bindingMetadata[key] === BindingTypes.SETUP_LET) {
      // local let binding, also add setter
      const setArg = key === 'v' ? `_v` : `v`
      returned +=
        `get ${key}() { return ${key} }, ` +
        `set ${key}(${setArg}) { ${key} = ${setArg} }, `
    } else {
      returned += `${key}, `
    }
  }
  returned = returned.replace(/, $/, '') + ` }`
```



最终return 的返回应该就是类型下面这样的

```js
`{
	get aa() { return aa }, 
        set aa(v) { aa = v }, 
        bb, cc, dd, 
        get a() { return a }, 
        set a(v) { a = v }, 
        b, c, d, 
        get xx() { return xx }, 
        get x() { return x } 
}
`
```



#### 有模版的情况

有模板需要进行模板变量绑定

需要把这里的绑定参数带入到编译模板那块

这就是另一个故事了





#### 10.3. 插入生成返回的绑定变量

```ts
if (!options.inlineTemplate && !__TEST__) {
  // in non-inline mode, the `__isScriptSetup: true` flag is used by
  // componentPublicInstance proxy to allow properties that start with $ or _
  ctx.s.appendRight(
    endOffset,
    `\nconst __returned__ = ${returned}\n` +
      `Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })\n` +
      `return __returned__` +
      `\n}\n\n`
  )
} else {
  ctx.s.appendRight(endOffset, `\nreturn ${returned}\n}\n\n`)
}
```



### 11.最终默认返回



```ts
const genDefaultAs = options.genDefaultAs
    ? `const ${options.genDefaultAs} =`
    : `export default`

 

  let definedOptions = ''
  if (ctx.optionsRuntimeDecl) {
    definedOptions = scriptSetup.content
      .slice(ctx.optionsRuntimeDecl.start!, ctx.optionsRuntimeDecl.end!)
      .trim()
  }
```





运行时添加的参数

```ts
let runtimeOptions = ``
if (!ctx.hasDefaultExportName && filename && filename !== DEFAULT_FILENAME) {
    const match = filename.match(/([^/\\]+)\.\w+$/)
if (match) {
    runtimeOptions += `\n  __name: '${match[1]}',`
}
}
if (hasInlinedSsrRenderFn) {
    runtimeOptions += `\n  __ssrInlineRender: true,`
}

const propsDecl = genRuntimeProps(ctx)
if (propsDecl) runtimeOptions += `\n  props: ${propsDecl},`

const emitsDecl = genRuntimeEmits(ctx)
if (emitsDecl) runtimeOptions += `\n  emits: ${emitsDecl},`
```





处理文本中的运行时option的内容

```ts
  let definedOptions = ''
  if (ctx.optionsRuntimeDecl) {
    definedOptions = scriptSetup.content
      .slice(ctx.optionsRuntimeDecl.start!, ctx.optionsRuntimeDecl.end!)
      .trim()
  }
```



### 12. 字符串中包裹在setup函数内部



```ts
if (defaultExport || definedOptions) {
  // without TS, can't rely on rest spread, so we use Object.assign
  // export default Object.assign(__default__, { ... })
  ctx.s.prependLeft(
    startOffset,
    `\n${genDefaultAs} /*#__PURE__*/Object.assign(${
      defaultExport ? `${normalScriptDefaultVar}, ` : ''
    }${definedOptions ? `${definedOptions}, ` : ''}{${runtimeOptions}\n  ` +
      `${hasAwait ? `async ` : ``}setup(${args}) {\n${exposeCall}`
  )
  ctx.s.appendRight(endOffset, `})`)
} else {
  ctx.s.prependLeft(
    startOffset,
    `\n${genDefaultAs} {${runtimeOptions}\n  ` +
      `${hasAwait ? `async ` : ``}setup(${args}) {\n${exposeCall}`
  )
  ctx.s.appendRight(endOffset, `}`)
}
```





### 13. 顶部处理vue相关的引入



```ts
if (ctx.helperImports.size > 0) {
    ctx.s.prepend(
      `import { ${[...ctx.helperImports]
        .map(h => `${h} as _${h}`)
        .join(', ')} } from 'vue'\n`
    )
}
```


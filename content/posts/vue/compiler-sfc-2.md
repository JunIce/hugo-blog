---
title: "vue3 -- @vue/compiler-sfc 工具源码解读"
date: 2022-07-04T09:19:01+08:00
tags: ["vue3", "@vue/compiler-sfc"]
categories: ["vue"]
draft: false
---



# @vue/compiler-sfc



>   "version": "3.2.37"



## parse 源码



接收2个参数

- source: 传入的模版文件的内容
- option: 解析配置

```typescript
export function parse(
  source: string,
  {
    sourceMap = true,
    filename = DEFAULT_FILENAME,
    sourceRoot = '',
    pad = false,
    ignoreEmpty = true,
    compiler = CompilerDOM
  }: SFCParseOptions = {}
): SFCParseResult {
  // ....
}
```



#### 构造出对应文件的key，以便缓存处理。 这里的缓存在不同的平台用不同的手段去实现

```typescript
const sourceToSFC = createCache<SFCParseResult>()

// .....


// 构造出唯一的key，用作缓存使用
  const sourceKey =
    source + sourceMap + filename + sourceRoot + pad + compiler.parse
  const cache = sourceToSFC.get(sourceKey)
  // 存在缓存的情况下直接返回
  if (cache) {
    return cache
  }
```



#### 构造出一个原始的descriptor对象

```typescript
  // 构造最终返回的descriptor对象
  const descriptor: SFCDescriptor = {
    filename,
    source, // 源文件内容
    template: null,
    script: null,
    scriptSetup: null,
    styles: [],
    customBlocks: [],
    cssVars: [],
    slotted: false,
    shouldForceReload: prevImports => hmrShouldReload(prevImports, descriptor)
  }
```



#### 使用编译器进行解析

```typescript
// 通过编译器最终编译后的结果
const ast = compiler.parse(source, {
  // ....
})
```



#### 拿到**ast**的结果后进行循环处理

拿到子元素的不同类型，通过`switch case`分别进行处理

- template
- script
- style

```typescript
ast.children.forEach(node => {
  if (node.type !== NodeTypes.ELEMENT) {
    return
  }
  // .....
  switch (node.tag) {
    case 'template':
      // template 标签
      if (!descriptor.template) {
        // 对descriptor的template进行赋值
        const templateBlock = (descriptor.template = createBlock(
          node,
          source,
          false
        ) as SFCTemplateBlock)
        templateBlock.ast = node

        // warn against 2.x <template functional>
        // 不再支持functional写法
        if (templateBlock.attrs.functional) {
          const err = new SyntaxError()
          err.loc = node.props.find(p => p.name === 'functional')!.loc
          errors.push(err)
        }
      } else {
        // 多个template标签抛错
        errors.push(createDuplicateBlockError(node))
      }
      break
    case 'script':
      const scriptBlock = createBlock(node, source, pad) as SFCScriptBlock
      // 是否是setup语法，包含setup属性
      const isSetup = !!scriptBlock.attrs.setup
      if (isSetup && !descriptor.scriptSetup) {
        // 写入scriptSetup
        descriptor.scriptSetup = scriptBlock
        break
      }
      if (!isSetup && !descriptor.script) {
        // 写入script
        descriptor.script = scriptBlock
        break
      }
      errors.push(createDuplicateBlockError(node, isSetup))
      break
    case 'style':
      // 写入styles属性
      const styleBlock = createBlock(node, source, pad) as SFCStyleBlock
			// ....
      descriptor.styles.push(styleBlock)
      break
    default:
      descriptor.customBlocks.push(createBlock(node, source, pad))
      break
  }
})
```



#### 对于css内容的二次处理，包括css中的变量绑定，样式的深层覆盖等问题



```typescript
// parse CSS vars
// 解析css中绑定参数
descriptor.cssVars = parseCssVars(descriptor)

// check if the SFC uses :slotted
// 检查css中是否包含slotted, 即插槽的样式覆盖
const slottedRE = /(?:::v-|:)slotted\(/
descriptor.slotted = descriptor.styles.some(
  s => s.scoped && slottedRE.test(s.content)
)
```



#### 处理完毕后加入缓存并且返回对象

```typescript
const result = {
  descriptor,
  errors
}
sourceToSFC.set(sourceKey, result)
return result
```





## compileTemplate



> packages/compiler-sfc/src/compileTemplate.ts





对于编译处理器的判断处理，如果用户是在浏览器侧使用，需要手动传入预处理器`preprocess`



```typescript
if (
  (__ESM_BROWSER__ || __GLOBAL__) &&
  preprocessLang &&
  !preprocessCustomRequire
) {
  throw new Error(
    `[@vue/compiler-sfc] Template preprocessing in the browser build must ` +
      `provide the \`preprocessCustomRequire\` option to return the in-browser ` +
      `version of the preprocessor in the shape of { render(): string }.`
  )
}

const preprocessor = preprocessLang
  ? preprocessCustomRequire
    ? preprocessCustomRequire(preprocessLang)
    : __ESM_BROWSER__
    ? undefined
    : consolidate[preprocessLang as keyof typeof consolidate]
  : false
```



主处理函数还是`doCompileTemplate`



#### doCompileTemplate



主编译函数还是个黑盒函数，被封装在compiler中了，后续再看



```typescript
let { code, ast, preamble, map } = compiler.compile(source, {
  mode: 'module', // 模块的形式
  prefixIdentifiers: true,
  hoistStatic: true, // 静态节点提升
  cacheHandlers: true,
  ssrCssVars:
    ssr && ssrCssVars && ssrCssVars.length
      ? genCssVarsFromList(ssrCssVars, shortId, isProd, true)
      : '',
  scopeId: scoped ? longId : undefined, // scoped时，会加入一个自定义id
  slotted,
  sourceMap: true,
  ...compilerOptions,
  nodeTransforms: nodeTransforms.concat(compilerOptions.nodeTransforms || []),
  filename,
  onError: e => errors.push(e),
  onWarn: w => warnings.push(w)
})
```



## compileScript



> packages/compiler-sfc/src/compileScript.ts



#### 取出当前script上的一些常量



```typescript
const enableReactivityTransform =
  !!options.reactivityTransform ||
  !!options.refSugar ||
  !!options.refTransform
const enablePropsTransform =
  !!options.reactivityTransform || !!options.propsDestructureTransform
const isProd = !!options.isProd
const genSourceMap = options.sourceMap !== false
let refBindings: string[] | undefined

const scopeId = options.id ? options.id.replace(/^data-v-/, '') : ''
// css变量参数
const cssVars = sfc.cssVars
// script上的lang值
const scriptLang = script && script.lang
// scriptSetup上的lang值
const scriptSetupLang = scriptSetup && scriptSetup.lang
// 是否需要ts
const isTS =
  scriptLang === 'ts' ||
  scriptLang === 'tsx' ||
  scriptSetupLang === 'ts' ||
  scriptSetupLang === 'tsx'
```



#### 整理处理文件内容需要的插件



- 动态加入jsx插件
- 如果需要typescript插件，则插入装饰器插件`decorators-legacy`





```typescript
// resolve parser plugins
const plugins: ParserPlugin[] = []
if (!isTS || scriptLang === 'tsx' || scriptSetupLang === 'tsx') {
  plugins.push('jsx')
} else {
  // If don't match the case of adding jsx, should remove the jsx from the babelParserPlugins
  if (options.babelParserPlugins)
    options.babelParserPlugins = options.babelParserPlugins.filter(
      n => n !== 'jsx'
    )
}
if (options.babelParserPlugins) plugins.push(...options.babelParserPlugins)
if (isTS) {
  plugins.push('typescript')
  if (!plugins.includes('decorators')) {
    plugins.push('decorators-legacy')
  }
}
```







## compileStyle



> packages/compiler-sfc/src/compileStyle.ts



### doCompileStyle



#### 使用css预处理器进行处理



```typescript
const preprocessor = preprocessLang && processors[preprocessLang]
const preProcessedSource = preprocessor && preprocess(options, preprocessor)
```



#### 在css处理插件处加入一些内置插件

- 在插件列表头部加入css中变量处理插件
- 如果需要trim， 加入trim插件
- 如果需要scoped， 加入scoped插件
- 如果需要模块的方式，加入模块处理的插件



```typescript
const plugins = (postcssPlugins || []).slice()
plugins.unshift(cssVarsPlugin({ id: shortId, isProd }))
if (trim) {
  plugins.push(trimPlugin())
}
if (scoped) {
  plugins.push(scopedPlugin(longId))
}
let cssModules: Record<string, string> | undefined
if (modules) {
  if (__GLOBAL__ || __ESM_BROWSER__) {
    throw new Error(
      '[@vue/compiler-sfc] `modules` option is not supported in the browser build.'
    )
  }
  if (!options.isAsync) {
    throw new Error(
      '[@vue/compiler-sfc] `modules` option can only be used with compileStyleAsync().'
    )
  }
  plugins.push(
    postcssModules({
      ...modulesOptions,
      getJSON: (_cssFileName: string, json: Record<string, string>) => {
        cssModules = json
      }
    })
  )
}
```



#### 使用postcss加上所有的插件，对内容进行处理



```typescript

try {
  result = postcss(plugins).process(source, postCSSOptions)

  // In async mode, return a promise.
  if (options.isAsync) {
    return result
      .then(result => ({
        code: result.css || '',
        map: result.map && result.map.toJSON(),
        errors,
        modules: cssModules,
        rawResult: result,
        dependencies: recordPlainCssDependencies(result.messages)
      }))
      .catch(error => ({
        code: '',
        map: undefined,
        errors: [...errors, error],
        rawResult: undefined,
        dependencies
      }))
  }

  recordPlainCssDependencies(result.messages)
  // force synchronous transform (we know we only have sync plugins)
  code = result.css
  outMap = result.map
} catch (e: any) {
  errors.push(e)
}
```




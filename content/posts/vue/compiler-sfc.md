---
title: "vue3 -- @vue/compiler-sfc 工具解读"
date: 2022-07-03T09:19:01+08:00
tags: ["vue3", "@vue/compiler-sfc"]
categories: ["vue"]
draft: false
---



# @vue/compiler-sfc



>   "version": "3.2.37"



**SFC**是vue中重要的一环，也是vue3中对于静态节点进行缓存提升的重要位置

SFC  -- single file Component 单文件组件，以**.vue**进行结尾，这个文件浏览器也不会识别，最终也是要被转换成js代码



SFC中包含三块，template、script、style等三块代码，分别表示模版、脚本、样式三块



**@vue/compiler-sfc**的作用就是把单文件组件编译成为js代码





## parse





下面就看一看具体的使用



新建一个`Foo.vue`组件

```vue
<template>
    <input type="text" v-model="name">
</template>
<script lang='ts'>
import { defineComponent, ref } from 'vue'
export default defineComponent({
    name: 'foo',
    setup() {
        return {
            name: ref('jack')
        }
    }
})
</script>
<style lang="scss">
input {
    color: #333;
}
</style>
```



组件同时包括`template`、`script`、`style`三块



新建一个nodejs脚本

```js
const { parse } = require("@vue/compiler-sfc")
const fs = require("fs")
fs.readFile("./foo.vue", (err, data) => {

    let parsed = parse(data.toString(), {
        filename: 'foo.vue'
    })
    console.log('parsed', parsed);

})
```



用fs读取到文件的内容后，使用`parse`解析, 最终会返回一个对象



```json
{
  descriptor: {
    filename: 'foo.vue',
    source: '<template>\n' +
      '    <input type="text" v-model="name">\n' +
      '</template>\n' +
      "<script lang='ts'>\n" +
      "import { defineComponent, ref } from 'vue'\n" +
      'export default defineComponent({\n' +
      "    name: 'foo',\n" +
      '    setup() {\n' +
      '        return {\n' +
      "            name: ref('jack')\n" +
      '        }\n' +
      '    }\n' +
      '})\n' +
      '</script>\n' +
      '<style lang="scss">\n' +
      'input {\n' +
      '    color: #333;\n' +
      '}\n' +
      '</style>\n',
    template: {
      type: 'template',
      content: '\n    <input type="text" v-model="name">\n',
      loc: [Object],
      attrs: {},
      ast: [Object],
      map: [Object]
    },
    script: {
      type: 'script',
      content: '\n' +
        "import { defineComponent, ref } from 'vue'\n" +
        'export default defineComponent({\n' +
        "    name: 'foo',\n" +
        '    setup() {\n' +
        '        return {\n' +
        "            name: ref('jack')\n" +
        '        }\n' +
        '    }\n' +
        '})\n',
      loc: [Object],
      attrs: [Object],
      lang: 'ts',
      map: [Object]
    },
    scriptSetup: null,
    styles: [ [Object] ],
    customBlocks: [],
    cssVars: [],
    slotted: false,
    shouldForceReload: [Function: shouldForceReload]
  },
  errors: []
}
```



**setup脚本改造foo.vue**



```vue
<template>
    <input type="text" v-model="name">
</template>
<script lang='ts' setup>
import { ref } from 'vue'

const name = ref('jack');
</script>
<style lang="scss">
input {
    color: #333;
}
</style>

```





**setup语法编译后的结果**

```json
{
  descriptor: {
    filename: 'foo.vue',
    source: '<template>\n' +
      '    <input type="text" v-model="name">\n' +
      '</template>\n' +
      "<script lang='ts' setup>\n" +
      "import { ref } from 'vue'\n" +
      '\n' +
      "const name = ref('jack');\n" +
      '</script>\n' +
      '<style lang="scss">\n' +
      'input {\n' +
      '    color: #333;\n' +
      '}\n' +
      '</style>\n',
    template: {
      type: 'template',
      content: '\n    <input type="text" v-model="name">\n',
      loc: [Object],
      attrs: {},
      ast: [Object],
      map: [Object]
    },
    script: null,
    scriptSetup: {
      type: 'script',
      content: "\nimport { ref } from 'vue'\n\nconst name = ref('jack');\n",
      loc: [Object],
      attrs: [Object],
      lang: 'ts',
      setup: true
    },
    styles: [ [Object] ],
    customBlocks: [],
    cssVars: [],
    slotted: false,
    shouldForceReload: [Function: shouldForceReload]
  },
  errors: []
}
```





唯一的不同就是编译后的结果从原来的**script**上迁移到**scriptSetup**上





## compileTemplate



拿到之前parse后的结果后，需要对template进行进一步的转换，把template结果进一步编译成对应的js vnode函数



```js

let compileredTemplate = compileTemplate({
    id: '123',
    filename: 'foo.vue',
    source: parsed.descriptor.template.content
})
console.log('parsed', compileredTemplate);

```



其中code的值就是最终模版编译的结果



```js
{
  code: 'import { vModelText as _vModelText, withDirectives as _withDirectives, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"\n' +
    '\n' +
    'export function render(_ctx, _cache) {\n' +
    '  return _withDirectives((_openBlock(), _createElementBlock("input", {\n' +
    '    type: "text",\n' +
    '    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.name) = $event))\n' +
    '  }, null, 512 /* NEED_PATCH */)), [\n' +
    '    [_vModelText, _ctx.name]\n' +
    '  ])\n' +
    '}',
  ast: {
    type: 0,
    children: [ [Object] ],
    helpers: [
      Symbol(vModelText),
      Symbol(withDirectives),
      Symbol(openBlock),
      Symbol(createElementBlock)
    ],
    components: [],
    directives: [],
    hoists: [],
    imports: [],
    cached: 1,
    temps: 0,
    codegenNode: {
      type: 13,
      tag: '"input"',
      props: [Object],
      children: undefined,
      patchFlag: '512 /* NEED_PATCH */',
      dynamicProps: undefined,
      directives: [Object],
      isBlock: true,
      disableTracking: false,
      isComponent: false,
      loc: [Object]
    },
    loc: {
      start: [Object],
      end: [Object],
      source: '\n    <input type="text" v-model="name">\n'
    },
    filters: []
  },
  preamble: '',
  source: '\n    <input type="text" v-model="name">\n',
  errors: [],
  tips: [],
  map: {
    version: 3,
    sources: [ 'foo.vue' ],
    names: [ 'name' ],
    mappings: ';;;wCACI,oBAAkC;IAA3B,IAAI,EAAC,MAAM;IADtB,6DACgCA,SAAI;;kBAAJA,SAAI',
    sourcesContent: [ '\n    <input type="text" v-model="name">\n' ]
  }
}
```



我们把结果单独拿出来看下



```js
import { vModelText as _vModelText, withDirectives as _withDirectives, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache) {
    return _withDirectives((_openBlock(), _createElementBlock("input", {
        type: "text",
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.name) = $event))
    }, null, 512 /* NEED_PATCH */)), [
        [_vModelText, _ctx.name]
    ])
}
```



最终返回了一个**render**函数，这里也就符合预期，vue组件中如果使用js的方式写，可以写一个render函数去渲染组件





## compilerScript



根据parsed的结果来解析脚本部分，compileScript接收2个参数，第一个就是之前parse的结果， 然后再传入相应的option



```js
let compileredScript = compileScript(parsed.descriptor, {
    id: '123'
})
console.log('parsed', compileredScript);
```



编译后的结果，content就是最终编译出的代码



```js
{
  type: 'script',
  content: "import { defineComponent as _defineComponent } from 'vue'\n" +
    "import { ref } from 'vue'\n" +
    '\n' +
    '\n' +
    'export default /*#__PURE__*/_defineComponent({\n' +
    '  setup(__props, { expose }) {\n' +
    '  expose();\n' +
    '\n' +
    "const name = ref('jack');\n" +
    '\n' +
    'const __returned__ = { name }\n' +
    "Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })\n" +
    'return __returned__\n' +
    '}\n' +
    '\n' +
    '})',
  loc: {
    source: "\nimport { ref } from 'vue'\n\nconst name = ref('jack');\n",
    start: { column: 25, line: 4, offset: 86 },
    end: { column: 1, line: 8, offset: 140 }
  },
  attrs: { lang: 'ts', setup: true },
  lang: 'ts',
  setup: true,
  bindings: { ref: 'setup-const', name: 'setup-ref' },
  imports: [Object: null prototype] {
    ref: {
      isType: false,
      imported: 'ref',
      source: 'vue',
      isFromSetup: true,
      isUsedInTemplate: false
    }
  },
  map: SourceMap {
    version: 3,
    file: null,
    sources: [ 'foo.vue' ],
    sourcesContent: [
      '<template>\n' +
        '    <input type="text" v-model="name">\n' +
        '</template>\n' +
        "<script lang='ts' setup>\n" +
        "import { ref } from 'vue'\n" +
        '\n' +
        "const name = ref('jack');\n" +
        '</script>\n' +
        '<style lang="scss">\n' +
        'input {\n' +
        '    color: #333;\n' +
        '}\n' +
        '</style>\n'
    ],
    names: [],
    mappings: ';AAIA,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AACzB;;;;;AAFwB;AAGxB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;;;;;;;'
  },
  scriptAst: undefined,
  scriptSetupAst: [
    Node {
      type: 'ImportDeclaration',
      start: 1,
      end: 26,
      loc: [SourceLocation],
      importKind: 'value',
      specifiers: [Array],
      source: [Node]
    },
    Node {
      type: 'VariableDeclaration',
      start: 28,
      end: 53,
      loc: [SourceLocation],
      declarations: [Array],
      kind: 'const'
    }
  ]
}
```



content格式化之后的结果， 所以说setup只是语法糖，最终还是以defineComponent去包裹一个对象进行返回的形式

```js
import { defineComponent as _defineComponent } from 'vue'
import { ref } from 'vue'


export default /*#__PURE__*/_defineComponent({
    setup(__props, { expose }) {
        expose();

        const name = ref('jack');

        const __returned__ = { name }
        Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
        return __returned__
    }

})
```



## compileStyle



compileStyle 即解析SFC style模块的入口函数



由于sfc中style块是可以写多个的，所以parse最终的结果styles其实是个数组

由变量签名也可以看出

```typescript
export interface SFCDescriptor {
  // ....
  styles: SFCStyleBlock[]
  
}
```



这里我们取第一个块打印出来看一下，实际情况下应该是去循环的



```js
let compileredStyle = compileStyle({
    source: parsed.descriptor.styles[0].content,
    scoped: true,
    id: 'data-v-123'
})
console.log('parsed', compileredStyle);
```



**编译结果**

其中code即是最终的css结果

```js
{
  code: '\ninput[data-v-123] {\n    color: #333;\n}\n',
  map: undefined,
  errors: [],
  rawResult: LazyResult {
    stringified: true,
    processed: true,
    result: Result {
      processor: [Processor],
      messages: [],
      root: [Root],
      opts: [Object],
      css: '\ninput[data-v-123] {\n    color: #333;\n}\n',
      map: undefined,
      lastPlugin: [Object]
    },
    helpers: {
      plugin: [Function: plugin],
      stringify: [Function],
      parse: [Function],
      fromJSON: [Function],
      list: [Object],
      comment: [Function (anonymous)],
      atRule: [Function (anonymous)],
      decl: [Function (anonymous)],
      rule: [Function (anonymous)],
      root: [Function (anonymous)],
      document: [Function (anonymous)],
      CssSyntaxError: [Function],
      Declaration: [Function],
      Container: [Function],
      Processor: [Function],
      Document: [Function],
      Comment: [Function],
      Warning: [Function],
      AtRule: [Function],
      Result: [Function],
      Input: [Function],
      Rule: [Function],
      Root: [Function],
      Node: [Function],
      default: [Function],
      result: [Result],
      postcss: [Function]
    },
    plugins: [ [Object], [Object], [Object] ],
    listeners: {
      Declaration: [Array],
      Rule: [Array],
      AtRule: [Array],
      OnceExit: [Array]
    },
    hasListener: true
  },
  dependencies: Set(0) {}
}
```






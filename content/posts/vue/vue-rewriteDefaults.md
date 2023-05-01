---
title: "Vue rewriteDefault解析"
date: 2023-05-01T09:28:50+08:00
draft: true
tags: ["vue3", "rewriteDefault"]
categories: ["vue"]
---






# Vue rewriteDefault解析



## rewriteDefault



通过重写`export default`的主体内容到一个变量中，可以劫持该变量做一些操作



```ts
export function rewriteDefault(
  input: string,
  as: string,
  parserPlugins?: ParserPlugin[]
): string {
  const ast = parse(input, {
    sourceType: 'module',
    plugins: parserPlugins
  }).program.body
  const s = new MagicString(input)

  rewriteDefaultAST(ast, s, as)

  return s.toString()
}

```



`rewriteDefault`做了以下几件事情

- 通过`babel`解析源码(`@babel/parser`)
- 通过`MagicString`操作源码



## rewriteDefaultAST



遍历ast的结果，这里需要遍历的原因是因为源码中可能会存在多个`export default`的情况

```ts
// export default class Foo {}
class Foo{}
```



### export default情况

- 输出class类
  - 这里会删除原来class前面的`export default`字符串
  - 添加一个`const variable= xxxx`
- 直接替换原来的`export default`字符



```ts
if (node.declaration.type === 'ClassDeclaration') {
    let start: number =
      node.declaration.decorators && node.declaration.decorators.length > 0
        ? node.declaration.decorators[
            node.declaration.decorators.length - 1
          ].end!
        : node.start!
    s.overwrite(start, node.declaration.id.start!, ` class `)
    s.append(`\nconst ${as} = ${node.declaration.id.name}`)
} else {
    s.overwrite(node.start!, node.declaration.start!, `const ${as} = `)
}

```



### export Named 情况



首先都是会删除原来和default相关的语句



#### export { } 中含有default的情况



删除原export中的语句，新添加一个变量进行赋值



转化前

```ts
const a = 1 
export { a as b }
export { a as default, a as c }
```

转换后

```ts
const a = 1 
export { a as b } 
export {  a as c }
const script = a
```





#### export { } 中含有default的, 并且是从其他文件导入的情况



这里会重命名一个`__VUE_DEFAULT__`变量， 原变量通过`import`的形式进行引入



转换前

```ts
export { default, foo } from './index.js'
```

转换后

```ts
import { default as __VUE_DEFAULT__ } from './index.js'
export {  foo } from './index.js'
const script = __VUE_DEFAULT__
```



#### 和修饰符相关的代码



```ts
for (const specifier of node.specifiers) {
    if (
      specifier.type === 'ExportSpecifier' &&
      specifier.exported.type === 'Identifier' &&
      specifier.exported.name === 'default'
    ) {
      if (node.source) {
        if (specifier.local.name === 'default') {
          s.prepend(
            `import { default as __VUE_DEFAULT__ } from '${node.source.value}'\n`
          )
          const end = specifierEnd(s, specifier.local.end!, node.end!)
          s.remove(specifier.start!, end)
          s.append(`\nconst ${as} = __VUE_DEFAULT__`)
          continue
        } else {
          s.prepend(
            `import { ${s.slice(
              specifier.local.start!,
              specifier.local.end!
            )} as __VUE_DEFAULT__ } from '${node.source.value}'\n`
          )
          const end = specifierEnd(s, specifier.exported.end!, node.end!)
          s.remove(specifier.start!, end)
          s.append(`\nconst ${as} = __VUE_DEFAULT__`)
          continue
        }
      }

      const end = specifierEnd(s, specifier.end!, node.end!)
      s.remove(specifier.start!, end)
      s.append(`\nconst ${as} = ${specifier.local.name}`)
    }
}
```



## specifierEnd



找到修饰语句的结尾索引，这里会从end开始索引，直到最后以为是`}`符结束，最后输出索引



```ts
function specifierEnd(s: MagicString, end: number, nodeEnd: number | null) {
  // export { default   , foo } ...
  let hasCommas = false
  let oldEnd = end
  while (end < nodeEnd!) {
    if (/\s/.test(s.slice(end, end + 1))) {
      end++
    } else if (s.slice(end, end + 1) === ',') {
      end++
      hasCommas = true
      break
    } else if (s.slice(end, end + 1) === '}') {
      break
    }
  }
  return hasCommas ? end : oldEnd
}

```





## 全部源码





```ts
ast.forEach(node => {
    if (node.type === 'ExportDefaultDeclaration') {
      if (node.declaration.type === 'ClassDeclaration') {
        let start: number =
          node.declaration.decorators && node.declaration.decorators.length > 0
            ? node.declaration.decorators[
                node.declaration.decorators.length - 1
              ].end!
            : node.start!
        s.overwrite(start, node.declaration.id.start!, ` class `)
        s.append(`\nconst ${as} = ${node.declaration.id.name}`)
      } else {
        s.overwrite(node.start!, node.declaration.start!, `const ${as} = `)
      }
    } else if (node.type === 'ExportNamedDeclaration') {
      for (const specifier of node.specifiers) {
        if (
          specifier.type === 'ExportSpecifier' &&
          specifier.exported.type === 'Identifier' &&
          specifier.exported.name === 'default'
        ) {
          if (node.source) {
            if (specifier.local.name === 'default') {
              s.prepend(
                `import { default as __VUE_DEFAULT__ } from '${node.source.value}'\n`
              )
              const end = specifierEnd(s, specifier.local.end!, node.end!)
              s.remove(specifier.start!, end)
              s.append(`\nconst ${as} = __VUE_DEFAULT__`)
              continue
            } else {
              s.prepend(
                `import { ${s.slice(
                  specifier.local.start!,
                  specifier.local.end!
                )} as __VUE_DEFAULT__ } from '${node.source.value}'\n`
              )
              const end = specifierEnd(s, specifier.exported.end!, node.end!)
              s.remove(specifier.start!, end)
              s.append(`\nconst ${as} = __VUE_DEFAULT__`)
              continue
            }
          }

          const end = specifierEnd(s, specifier.end!, node.end!)
          s.remove(specifier.start!, end)
          s.append(`\nconst ${as} = ${specifier.local.name}`)
        }
      }
    }
})
```




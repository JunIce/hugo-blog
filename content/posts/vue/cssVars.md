---
title: "vue -- cssVars css绑定变量"
date: 2022-06-26T15:26:32+08:00
tags: ["vue3"]
categories: ["vue"]
draft: false
---



# Vue3 cssVars



>   "version": "3.2.37"



`vue3`中单文件SFC有个新特性，就是在css里可以使用变量了



```vue
<template>
  <div>
    <h1>123</h1>
  </div>
</template>

<script lang='ts' setup>
const color = 'red'
</script>

<style scoped>
 h1 {
    color: v-bind(color)
 }
</style>
```



具体的代码就是使用v-bind去绑定变量值，这里预览的结果就是`h1`会显示出红色



查看`h1`的标签，可以看到

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c4d6199e13f4b69aa195a49fa6707ed~tplv-k3u1fbpfcp-watermark.image?)

color使用的是 css自带的变量`var`语法进行绑定的

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb0553d925854905a01b2fa937f92819~tplv-k3u1fbpfcp-watermark.image?)



并且把变量值绑定到父元素上，通过js写入到父元素的行内样式里



css变量绑定分为2个阶段

- 编译阶段，把变量转换成css `var`变量语法机制
- 运行时阶段，js动态改变父元素上的变量绑定



## doCompileStyle



这个函数是`compileStyle`的主函数，其主要作用就是把SFC中的css部分编译识别出来



其中也有很多处理代码，最终也是使用postcss去处理

```typescript
// .....
const shortId = id.replace(/^data-v-/, '')
const longId = `data-v-${shortId}`

const plugins = (postcssPlugins || []).slice()
plugins.unshift(cssVarsPlugin({ id: shortId, isProd }))

// ....
```



可以看到其中最第一位的就是在plugins的首位插入了一个插件，就是cssVarsPlugin



## cssVarsPlugin



插件中通过正则匹配`v-bind`在字符串中的位置进行匹配替换



```typescript

const vBindRE = /v-bind\s*\(/g
//....

export const cssVarsPlugin: PluginCreator<CssVarsPluginOptions> = opts => {
  const { id, isProd } = opts!
  return {
    postcssPlugin: 'vue-sfc-vars',
    Declaration(decl) {
      // rewrite CSS variables
      const value = decl.value
      if (vBindRE.test(value)) {
        // 重置匹配位置到首位
        vBindRE.lastIndex = 0
        // 匹配后的字符
        let transformed = ''
        
        let lastIndex = 0
        let match
        
        while ((match = vBindRE.exec(value))) {
          // 匹配字符的开始位置
          const start = match.index + match[0].length
          const end = lexBinding(value, start)
          if (end !== null) {
            const variable = normalizeExpression(value.slice(start, end))
            transformed +=
              value.slice(lastIndex, match.index) +
              `var(--${genVarName(id, variable, isProd)})`
            lastIndex = end + 1
          }
        }
        decl.value = transformed + value.slice(lastIndex)
      }
    }
  }
}
cssVarsPlugin.postcss = true
```



最终会在transformed进行字符串拼接， 并且生成一个`var(--${genVarName(id, variable, isProd)})`字符串，其中`genVarname`会根据当前组件的id进行生成，生产环境就是用随机字符串生成的

lastIndex会在拼接后向后移动1位

最后css转换后的值，v-bind就被替换成css的`var()`语法



### lexBinding



lexBinding函数要结合上下文来看，v-bind的括号中变量是有多重形式的



其中可能会有括号

```css
font-weight: v-bind("count.toString(");
font-weight: v-bind(xxx);
```



官方代码中就是使用for循环，结合`switch\case`, 最终找到最后一个`)`,返回索引值，也就是end值



```typescript
function lexBinding(content: string, start: number): number | null {
  let state: LexerState = LexerState.inParens
  let parenDepth = 0

  for (let i = start; i < content.length; i++) {
    const char = content.charAt(i)
    switch (state) {
      case LexerState.inParens:
        if (char === `'`) {
          state = LexerState.inSingleQuoteString
        } else if (char === `"`) {
          state = LexerState.inDoubleQuoteString
        } else if (char === `(`) {
          parenDepth++
        } else if (char === `)`) {
          if (parenDepth > 0) {
            parenDepth--
          } else {
            return i
          }
        }
        break
      case LexerState.inSingleQuoteString:
        if (char === `'`) {
          state = LexerState.inParens
        }
        break
      case LexerState.inDoubleQuoteString:
        if (char === `"`) {
          state = LexerState.inParens
        }
        break
    }
  }
  return null
}
```





### normalizeExpression

传入的是context截取的从开始到结束的字符串

如果是`'/"`,返回去除的字符串

```typescript
function normalizeExpression(exp: string) {
  exp = exp.trim()
  if (
    (exp[0] === `'` && exp[exp.length - 1] === `'`) ||
    (exp[0] === `"` && exp[exp.length - 1] === `"`)
  ) {
    return exp.slice(1, -1)
  }
  return exp
}
```





## genCssVarsCode



编译后要去动态响应值的变化，就必然要通过js去控制css的值，这里通过`genCssVarsCode`函数去生存响应的代码

- vars 通过编译后搜集的变量名
- bindings 当前组件中script暴露的变量
- id 当前组件的id



```typescript
export function genCssVarsCode(
  vars: string[],
  bindings: BindingMetadata,
  id: string,
  isProd: boolean
) {
  // 根据当前组件css搜集的变量名，生成以逗号分隔的字符串，最后用大括号包围
  const varsExp = genCssVarsFromList(vars, id, isProd)
  // 组装成一个对象，其中content就是之前生成的字符串
  const exp = createSimpleExpression(varsExp, false)
  
  // ....
  
  const transformed = processExpression(exp, context)
  // ... 这里是伪代码， 中间还有其他判断
  const transformedString = transformed.content

  // 最终会生成一个字符串
  return `_${CSS_VARS_HELPER}(_ctx => (${transformedString}))`
}
```



我们把中间的变量替换过来，就是

> \_useCssVars(\_ctx => ({
>
> // ..... 中间就是css的动态变量的代码
>
> }))





## useCssVars



`watchPostEffect`是在组件更新之后调用



同时在`onMounted`钩子函数内，使用`MutationObserver`监听父元素下的子元素变化，只要子元素发生变化，都会调用`setVars`函数



```typescript
export function useCssVars(getter: (ctx: any) => Record<string, string>) {
  if (!__BROWSER__ && !__TEST__) return

  const instance = getCurrentInstance()
  /* istanbul ignore next */
  if (!instance) {
    __DEV__ &&
      warn(`useCssVars is called without current active component instance.`)
    return
  }

  const setVars = () =>
    setVarsOnVNode(instance.subTree, getter(instance.proxy!))
  watchPostEffect(setVars)
  onMounted(() => {
    const ob = new MutationObserver(setVars)
    ob.observe(instance.subTree.el!.parentNode, { childList: true })
    onUnmounted(() => ob.disconnect())
  })
}
```



### setVarsOnVNode



根据vode向上递归，找到非组件的父元素，要知道useCssVars是在运行时执行的，所以就是你写的html 元素节点



最后就是把属性写入到父元素的style属性内



```typescript
function setVarsOnVNode(vnode: VNode, vars: Record<string, string>) {
  if (__FEATURE_SUSPENSE__ && vnode.shapeFlag & ShapeFlags.SUSPENSE) {
    const suspense = vnode.suspense!
    vnode = suspense.activeBranch!
    if (suspense.pendingBranch && !suspense.isHydrating) {
      suspense.effects.push(() => {
        setVarsOnVNode(suspense.activeBranch!, vars)
      })
    }
  }

  // drill down HOCs until it's a non-component vnode
  // vnode 向上递归，直到vnode不存在component属性
  while (vnode.component) {
    vnode = vnode.component.subTree
  }
	
  // 设定属性值
  if (vnode.shapeFlag & ShapeFlags.ELEMENT && vnode.el) {
    setVarsOnNode(vnode.el as Node, vars)
  } else if (vnode.type === Fragment) {
    // 如果是Fragment，递归调用
    ;(vnode.children as VNode[]).forEach(c => setVarsOnVNode(c, vars))
  } else if (vnode.type === Static) {
    // 静态节点
    let { el, anchor } = vnode
    while (el) {
      setVarsOnNode(el as Node, vars)
      if (el === anchor) break
      el = el.nextSibling
    }
  }
}

function setVarsOnNode(el: Node, vars: Record<string, string>) {
  // 根据nodeType, 如果node是元素属性
  if (el.nodeType === 1) {
    const style = (el as HTMLElement).style
    // 使用setProperty
    for (const key in vars) {
      style.setProperty(`--${key}`, vars[key])
    }
  }
}
```


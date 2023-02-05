---
title: "vue -- compileTemplate原理"
date: 2023-02-04T15:26:32+08:00
tags: ["vue3", "sfc", "compileTemplate"]
categories: ["vue"]
draft: false
---



# Vue3 compileTemplate



`packages/compiler-sfc/src/compileTemplate.ts`

>   "version": "3.2.45"



vue3对于sfc文件的编译解读



### compileTemplate

第一步，走的是文件预处理的脚本，类似如果我们在template中使用了pug等模板，会预先通过预处理函数处理过，再传入到主编译函数`doCompileTemplate`

```typescript

export function compileTemplate(
  options: SFCTemplateCompileOptions
): SFCTemplateCompileResults {
  const { preprocessLang, preprocessCustomRequire } = options
	// ......
  if (preprocessor) {
    try {
      // 
      return doCompileTemplate({
        ...options,
        // 预处理函数。。。，传入的source已经是处理过后的了
        source: preprocess(options, preprocessor)
      })
    } catch (e: any) {
      // ...
    }
  } else {
    // 没有预处理的，直接走compile函数
    return doCompileTemplate(options)
  }
}
```



### doCompileTemplate



doCompileTemplate主函数中，主要实现的就是读取template中的内容，通过`@vue/compiler-core`暴露的`compile`方法进行编译，最终返回编译过的代码和源码等参数



```typescript

function doCompileTemplate(SFCTemplateCompileOptions) {
	// ....
  let nodeTransforms: NodeTransform[] = []
  if (isObject(transformAssetUrls)) {
    const assetOptions = normalizeOptions(transformAssetUrls)
    nodeTransforms = [
      createAssetUrlTransformWithOptions(assetOptions),
      createSrcsetTransformWithOptions(assetOptions)
    ]
  } else if (transformAssetUrls !== false) {
    nodeTransforms = [transformAssetUrl, transformSrcset]
  }

	// 调用编译内核，具体转换的代码在@vue/compiler-core之中实现
  let { code, ast, preamble, map } = compiler.compile(source, {
    //...
  })

  // ...
	
  return { code, ast, preamble, source, errors, tips, map }
}
```





#### transformAssetUrl

这个方法实现的是转换**vdom**中的**相对路径**转换成**绝对路径**

``` js
// Before
createVNode('img', { src: './logo.png' })
// After
import _imports_0 from './logo.png'
createVNode('img', { src: _imports_0 })
```




---
title: "element-plus 老版本cascader使用卡死问题"
date: 2023-10-17T13:16:27+08:00
tags: ["element-plus"]
categories: ["vue"]
draft: false
---



# element-plus 老版本cascader使用卡死





重写`Cascader`组件



```ts
import { ElCascader } from "element-plus"
import { watch, defineComponent } from "vue"

export default defineComponent({
  extends: ElCascader,
  name: 'ElCascader',
  setup(props, ctx){
    const instance = ElCascader.setup(props, ctx)
    
    watch(() => instance.popperVisible, () => {
      const $el = document.querySelectorAll('.el-cascader-panel .el-cascader-node[aria-owns]')
      Array.from($el).map(item => item.removeAttribute('aria-owns'))
    })
    
    return instance
  }
})
```









### references

https://github.com/ElemeFE/element/issues/22060
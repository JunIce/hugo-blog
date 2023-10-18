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
import { defineComponent, onMounted, onBeforeMount } from "vue"
import { ElCascader } from "element-plus";

function cascaderVisable() {
  const children = document.querySelectorAll(
    ".el-cascader-panel .el-cascader-menu"
  );
  Array.from(children).map((item) => item.removeAttribute("id"));
}

export default defineComponent({
  extends: ElCascader,
  name: "ElCascader",
  setup(props, ctx) {
    const observer = new MutationObserver(cascaderVisable)
    onMounted(() => {
      observer.observe(document.body,{ attributes: true, childList: true, subtree: true })
    })
    onBeforeMount(() => {
      observer.disconnect()
    })
    return ElCascader.setup(props, ctx)
  },
});
```









### references

https://github.com/ElemeFE/element/issues/22060
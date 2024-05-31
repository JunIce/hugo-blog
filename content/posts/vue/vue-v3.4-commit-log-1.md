---
title: "vue -- v3.4commit提交记录2"
date: 2024-05-30T15:26:32+08:00
tags: ["vue3", "v3.4"]
categories: ["vue"]
draft: false
---

# vue -- v3.4commit提交记录2



From `2024-02`

1. 修复hydrant过程中css 绑定变量时的报错

   ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23e51b66b360472ba6c2fbee71da54fd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=594&h=230&s=15146&e=png&b=4c5a2c)

2. 支持slot中简写语法

   ```vue
   <slot :name />
   ```

   

   ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0679e4469afd446ba21bff93e8f460e5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=769&h=421&s=36901&e=png&b=222121)



3. 修复computed中循环引用问题，优化effect中取值

   `commitId: 6c7e0bd88f021b0b6365370e97b0c7e243d7d70b`

   脏值检查增加了一个等级，如果QueryingDirty 等于目前的脏值等级，不会重新计算值，优化响应式取值

   

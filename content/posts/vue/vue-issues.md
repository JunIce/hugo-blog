---
title: "vue -- 使用中问题整理"
date: 2022-08-03T15:26:32+08:00
tags: ["vue-issues"]
categories: ["vue"]
draft: false

---

# vue -- 使用中问题整理





### [Vue warn]: The setup binding property "xxx" is already declared. 

https://github.com/vuejs/composition-api/issues/213

在vue2中使用`@vue/composition-api`, 出现上面的报错，需要检查一下项目中应该是引用了多个版本的`composition-api`




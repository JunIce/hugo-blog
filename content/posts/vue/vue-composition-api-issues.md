---
title: "Vue -- Composition Api 1"
date: 2021-03-21T20:46:33+08:00
draft: true
tags: ["vue2", "@vue/composition-api"]
categories: ["vue"]
---

## @vue/composition-api 解读1



### 【Bug】 Uncaught Error: [vue-composition-api] must call Vue.use(VueCompositionAPI) before using any function 

[vue.js - vue2 and composition api - cannot import store, error [vue-composition-api\] must call Vue.use(VueCompositionAPI) before using any function - Stack Overflow](https://stackoverflow.com/questions/69846717/vue2-and-composition-api-cannot-import-store-error-vue-composition-api-must)

需要在使用之前实例化



### The setup binding property "xxx" is already declared.

[The setup binding property "xxx" is already declared. · Issue #963 · vuejs/composition-api (github.com)](https://github.com/vuejs/composition-api/issues/963)

把^2.6.11的^去掉，否则会下载2.7.x



### [Vue warn]: Error in data(): "Error: [vue-composition-api] must call Vue.use(plugin) before using any function.

[https://github.com/vuejs/composition-api/issues/239](https://github.com/vuejs/composition-api/issues/239)

[https://github.com/vuejs/composition-api/issues/228](https://github.com/vuejs/composition-api/issues/228)

[https://github.com/vuejs/composition-api/issues/372](https://github.com/vuejs/composition-api/issues/372)

[https://github.com/vuejs/composition-api/issues/340](https://github.com/vuejs/composition-api/issues/340)

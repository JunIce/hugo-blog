---
title: "vue3 -- Class 对象在组件中使用范例"
date: 2023-10-31T06:29:01+08:00
tags: ["vue3", "class object", "reactive"]
categories: ["vue"]
draft: false
type: "vue"
---


# vue3 -- Class 对象在组件中使用范例



```vue
<script setup>
import { ref, reactive } from "vue";

class FooItem {
  constructor() {
    this.a = 0;
  }
  increase(item) {
    item.a += 1;
    console.log(item);
  }
}

class Foo {
  constructor() {
    this.a = 1;
    this.list = [];
  }

  increase() {
    this.a += 1;
  }
  add(item) {
    this.list.splice(0, 0, item);
  }
}

const count = ref(new Foo());
const onClick = () => {
  count.value.increase();
};
const onAdd = () => {
  count.value.add(new FooItem());
};
</script>

<template>
  <div v-for="i in count.list">
    {{ i.a }} <button @click="i.increase(i)">inc</button>
  </div>
  <button @click="onClick">Count is: {{ count.a }}</button>
  <button @click="onAdd">add</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

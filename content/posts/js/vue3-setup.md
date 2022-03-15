---
title: "Vue3 Composition API -- setup内 props 和 component 使用"
date: 2022-02-23T15:34:33+08:00
draft: true
tags: ["vue3"]
categories: ["vue"]
---

## setup script

setup script 是 vue3 中新加的开发模式，加在原来 vue sfc script 部分

> vscode 开启 setup 语法提示， 需要去插件市场安装 `volar`, 同时禁用`vetur`

```vue
<script setup>
// your logic
</script>
```

### 使用 props

```vue
<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  foo: String,
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["change", "click"]);

// props usage
props.foo;

// emits usage
emits("change", ...args);
</script>

<template>
  <div>{{ foo }}</div>
</template>
```

- ts 开发时 定义默认值

> setup 使用类型推导props时， 需要把定义写在`setup`内部， 目前还不能做到从外面引入 \
> [https://github.com/vuejs/core/issues/4294](https://github.com/vuejs/core/issues/4294)



```vue
<script setup lang="ts">
import { defineProps, withDefaults } from "vue";

interface Props {
  msg?: string;
}

const props = withDefaults(defineProps<Props>(), {
  msg: "hello",
});

</script>
```

### 使用组件

- 1. 常规引入使用

```vue
<script setup>
import MyComponent from "./MyComponent.vue";
</script>
<template>
  <MyComponent />
</template>
```

- 2. 动态组件

使用 `component` 内置组件的 `is` 熟悉

```vue
<script setup>
import Foo from "./Foo.vue";
import Bar from "./Bar.vue";
</script>
<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

- 3. 引入组件的重命名

```vue
<script setup>
import { Foo as FooChild } from "./components";
</script>
<template>
  <FooChild />
</template>
```

- 4. 有命名空间的组件 Namespaced Components

```vue
<script setup>
import * as Form from "./form-components";
</script>
<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

- 5. 懒加载组件 `Lazy load Components`

通过 `defineAsyncComponent` 异步加载

```vue
<script setup>
import { defineAsyncComponent } from 'vue'
const MyComponent = defineAsyncComponent(() => import(./MyComponent.vue))
</script>
<template>
  <MyComponent />
</template>
```

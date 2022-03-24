---
title: "Vue3 -- break change 补充知识点"
date: 2022-03-15T08:00:00+08:00
draft: true
tags: ["vue3"]
categories: ["vue"]
---
# vue3中更新知识点

## createApp

应用初始化

```typescript
import { createApp } from 'vue'

const app = createApp(App)
app.mount('#app')
```

### mount

`vue2`中替换`mount`参数的节点

`vue3`中是mount节点的子节点 == innerHTML



## data

只能接受返回对象的`function`

### mixin

​	`mixin`中data的声明和data进行浅合并



## key





## setup

`vue3`中最大的更新就是新增了`setup`语法，`setup`中拿不到`this`。

组件实例的获取在`setup`中使用`getCurrentInstance`，拿到组件实例。

`setup`函数包括两个属性：`props & context`;

```typescript
const ref = getCurrentInstance();
```

setup返回一个对象，对象可以在模板中直接使用

```vue
<template>
  <div >
    <p>{{count}}</p>
      
    <button @click="onIncrease">increase</button>
    <button @click="onDecrease">decrease</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref } from 'vue'

export default defineComponent({
  name: 'Home',
  setup() {
    const count = ref(0)

    const onIncrease = () => count.value++
    const onDecrease = () => count.value--

    return {
      count,
      onIncrease,
      onDecrease
    }
  }
})
</script>

```

具体的`setup`语法中的使用方式[Vue3 Composition API -- setup内 props 和 component 使用 - 时间的朋友 (storycn.cn)](https://blog.storycn.cn/posts/js/vue3-setup/)



### props

父组件传递给子组件的属性

### context

包括三个属性： `{ attrs、slots、emit }`





## ref,reactive

`vue3`中组件的响应式，需要去手动声明了

其中`ref`可以用作单个基础类型变量的响应式，也可以用来保存组件实例的引用， 代码中读取ref的值都必须要通过`.value`的形式去读取，由这个也能推测出，`vue`基础类型的值实现响应式的原理就是通过把值包裹成一个对象去进行响应式的。内部同样是使用`reactive`包裹实现响应式。



获取`html`组件的`dom`实例方式：通过ref声明一个变量，在setup中返回，在`vue`模板中需要引用的`dom`元素上定义一个同名的`ref`属性，后可以在`js`中的`onMounted`属性中可以拿到

```vue
<template>
  <div>
    <button ref="btnRef" @click="onIncrease">increase</button>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'

export default defineComponent({
  setup() {
    const btnRef = ref(null)

    onMounted(() => {
      console.log(btnRef.value)
    })

    return {
      btnRef
    }
  }
})
</script>

```



## [生命周期函数](https://v3.cn.vuejs.org/guide/composition-api-lifecycle-hooks.html)

删除了`beforeCreate`，`created`

| 选项式 API        | `setup` 中          |
| ----------------- | ------------------- |
| `beforeCreate`    | --                  |
| `created`         | --                  |
| `beforeMount`     | `onBeforeMount`     |
| `mounted`         | `onMounted`         |
| `beforeUpdate`    | `onBeforeUpdate`    |
| `updated`         | `onUpdated`         |
| `beforeUnmount`   | `onBeforeUnmount`   |
| `unmounted`       | `onUnmounted`       |
| `errorCaptured`   | `onErrorCaptured`   |
| `renderTracked`   | `onRenderTracked`   |
| `renderTriggered` | `onRenderTriggered` |
| `activated`       | `onActivated`       |
| `deactivated`     | `onDeactivated`     |



## 虚拟的Fragment

原来的vue2中，模板代码必须包含在一个html标签之内，vue3之后实现了一个虚拟的Fragment，可以直接把代码并列书写

```vue
<template>
  <p>{{name}}</p>
  <p>1</p>
  <p>2</p>
  <p>3</p>
</template>
```

##  h函数

`h`在`vue2`中是`render`函数的参数



`vue3`中是从`vue`中引入的

```js
import { h } from 'vue'
```



## nextTick



`vue2`中使用是`vm.$nextTick`

`vue3`中需要从`vue`中引入

```js
import { nextTick } from 'vue'
```



## 自定义组件`v-model`

`v-model` prop 和事件默认名称调整： `value`更改为`modelValue`, `input`更改为`update:modelValue`

。同时一个组件上可以有多个`v-model`

`vue2`中子组件中需要定义`model`

```js
model: {
    prop: 'title',
    event: 'change'
},
```



`vue3`中不需要定义了，但需要显式的定义`emit`

`child2.vue`

```vue
<template>
  <input id="child2" type="text" :value="modelValue" @input="onInputChange">
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    props: {
        modelValue: String
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const onInputChange = (e: any) => {
            emit('update:modelValue', e.target.value)
        }

        return {
            onInputChange
        }
    }
})
</script>
```



`parent.vue` 定义`modelValue`, 通过`@update:modelValue`去显式更新`modelvalue`的值

```vue
<template>
  <div>
    <Child2 :modelValue="child2Value" @update:modelValue="child2Value = $event"></Child2>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Child2 from "./Child2.vue"

export default defineComponent({
  components: {
    Child2
  },
  setup() {

    const child2Value = ref('1')

    watch(child2Value, () => {
      console.log('change value:', child2Value.value)
    })

    return {
      child2Value,
    }
  }
})
</script>

```

**其中删除了vue2中`.sync`语法**



## $listeners

**移除**。 `vue2`中`$listeners`包含了组件所有的监听事件，`vue3`中监听事件都包含在`$attrs`中



## $attrs

`vue2`中`$attrs`、`style`和`class`在`vnode`中是分开定义的。

 `vue3`中`style`、`class`和原生定义的属性都会包含在`$attrs`中， 同时也会包含定义的监听事件，以`on`开头的事件。

`parent.vue`

```html
<Child id="child3" class="child3-demo"></Child>
```

`child.vue`

```vue
<template>
  <label>
      <input type="text">
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
    inheritAttrs: false
})

</script>
```

**inheritAttrs**: 

-   **true**:  最终的`html`中，`label`上会有`id`和`class`属性  
-   **false**： `label`上没有父组件上定义的属性



## $children

`vue3`中删除了这个属性，需要通过`ref`获取子组件



## $on、$off、$once

**移除**。 现在事件总线需要使用第三方库。



## filters

**移除**。过滤器现在推荐使用computed或者函数去实现。



## 自定义指令

指令中新增了多个生命周期的勾子

```javascript
const CustonDirective = {
  created(el, binding, vnode, prevVnode) {}, // 新增
  beforeMount() {},
  mounted() {},
  beforeUpdate() {}, // 新增
  updated() {},
  beforeUnmount() {}, // 新增
  unmounted() {}
}
```



**`mounted`** 中 `binding`可以拿到组件实例，**如果是Fragment, 自定义组件就会被忽略**



## scopedSlots

**移除** 。 现在所有的插槽都合并到`slots`中去了



## teleport



`teleport` 是`vue3`中新增的组件， 用于把节点动态渲染到指定的节点下面。

**当多个节点指向同一个`teleport`时会进行`insertAfter`操作，增加兄弟节点**

```vue
<teleport to="body">
      <h1>hello vue</h1>
      {{count}}
</teleport >
```

### to

选择器标签。 `#id` or `.class`

### disabled

是否禁用


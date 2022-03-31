---
title: "Vue -- Composition Api 封装Promise"
date: 2021-03-21T20:49:17+08:00
draft: true
tags: ["vue2", "@vue/composition-api"]
categories: ["vue"]
---

为减少loading态的重复代码，利用新API封装

```js
import { watch, reactive, toRefs } from '@vue/composition-api'

export default {
  name: 'VPromise',
  props: {
    promise: {
      validator: p =>
        p && typeof p.then === 'function' && typeof p.catch === 'function'
    }
  },
  setup(props) {
    const promise = props.promise

    const state = reactive({
      resolved: false,
      data: null,
      error: null
    })

    watch(
      () => promise,
      p => {
        if (p) {
          p.then(data => {
            if (promise === p) {
              state.data = data
              state.resolved = true
            }
          }).catch(err => {
            if (promise === p) {
              state.error = err
              state.resolved = true
            }
          })
        }
      }
    )

    return {
      ...toRefs(state)
    }
  },
  render(h) {
    let slots = this.$scopedSlots

    if (this.error) {
      return h('span', slots['error'](this.error))
    }

    if (this.resolved) {
      return h('span', slots['resolved'](this.data))
    }

    return h('span', slots['pending'](this.data))
  }
}

```

模版中使用

```vue
<promise :promise="promise">
    <template v-slot:pending>
        <span>loading</span>
    </template>
    <template v-slot:resolved="data">
        <span>{{data}}</span>
    </template>
    <template v-slot:error>
        <span>render-error</span>
    </template>
</promise>
```

其中promise 传入一个promise对象
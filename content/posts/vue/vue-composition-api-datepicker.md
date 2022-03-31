---
title: "Vue -- Composition Api 基于antdv封装Datepicker"
date: 2021-03-21T20:50:27+08:00
draft: true
tags: ["vue2", "@vue/composition-api"]
categories: ["vue"]
---


```js
import { DatePicker } from 'ant-design-vue'
import moment from 'moment'
import { reactive, toRefs, watch } from '@vue/composition-api'

export default {
  name: 'OleDatePicker',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: String
  },
  setup (props, { attrs, emit }) {
    const state = reactive({ dateValue: null })

    let { showTime } = attrs

    watch(() => props.value, v => {
      state.dateValue = v ? moment(v) : null
    })

    watch(() => state.dateValue, (v) => {
      const format = showTime ? `YYYY-MM-DD HH:mm:ss` : `YYYY-MM-DD`
      let dateEmit = v ? moment(v).format(format) : null
      emit('change', dateEmit)
    })

    const handleChange = (date) => {
      state.dateValue = date
    }

    return {
      ...toRefs(state),
      handleChange
    }
  },
  render () {
    const props = {
      attrs: this.$attrs,
      props: {
        ...this.$attrs,
        value: this.dateValue
      },
      on: {
        ...this.$listeners,
        change: this.handleChange
      }
    }
    return <DatePicker {...props}></DatePicker>
  }
}
```
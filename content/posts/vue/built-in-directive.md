---
title: "vue -- 内置指令源码分析"
date: 2022-06-26T15:26:32+08:00
tags: ["vue3"]
categories: ["vue"]
draft: false

---





# vue内置指令



>   "version": "3.2.37"



vue因为在核心中内置了一些指令，开箱即用就非常nice



## v-model



vue中最具特色的指令就是v-mode了，可以把input的值进行绑定，结合双向绑定，可以最少代码就能把输入的值显示到页面上



```vue
<input v-model="message" placeholder="edit me" />
<p>Message is: {{ message }}</p>
```



看一下vue3下面的具体实现



> packages/runtime-dom/src/directives/vModel.ts



### vModelDynamic

在不同的生命周期下调用不同的勾子函数，包括`created`,`mounted`,`beforeUpdate`,`updated`这四个生命周期

```typescript
export const vModelDynamic: ObjectDirective<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
> = {
  created(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, 'created')
  },
  mounted(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, 'mounted')
  },
  beforeUpdate(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, 'beforeUpdate')
  },
  updated(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, 'updated')
  }
}

function callModelHook(
  el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  binding: DirectiveBinding,
  vnode: VNode,
  prevVNode: VNode | null,
  hook: keyof ObjectDirective
) {
  const modelToUse = resolveDynamicModel(
    el.tagName,
    vnode.props && vnode.props.type
  )
  // 这里modelToUse就可以看出是一个包含不同生命周期函数的对象，隐藏了最终的实现，其实就是一种adapter模式
  const fn = modelToUse[hook] as DirectiveHook
  fn && fn(el, binding, vnode, prevVNode)
}
```



### resolveDynamicModel

这里一看，其实是根据不同的标签名走不同的分支了，正常需要去用v-model的元素就这么几类了

```typescript
function resolveDynamicModel(tagName: string, type: string | undefined) {
  switch (tagName) {
    case 'SELECT':
      return vModelSelect
    case 'TEXTAREA':
      return vModelText
    default:
      switch (type) {
        case 'checkbox':
          return vModelCheckbox
        case 'radio':
          return vModelRadio
        default:
          return vModelText
      }
  }
}
```



### getModelAssigner



这是一个非常重要的函数了，直接决定了绑定元素对外响应的所绑定的函数



```typescript
const getModelAssigner = (vnode: VNode): AssignerFn => {
  const fn =
    vnode.props!['onUpdate:modelValue'] ||
    (__COMPAT__ && vnode.props!['onModelCompat:input'])
  return isArray(fn) ? value => invokeArrayFns(fn, value) : fn
}
```



最终响应的是props上的`update:modelValue`所绑定的事件，这里就和vue2不太一样了，内部绑定的值也换成modelValue了



![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a3defad9ab448d89dce167bfbacc487~tplv-k3u1fbpfcp-watermark.image?)



**官方文档说明**

https://v3.cn.vuejs.org/guide/migration/v-model.html#v-model





### vModelText 常规文本绑定



**created**生命周期内绑定事件，lazy修饰符表示走不同的监听方法

**mounted**生命周期内重置输入框初始值

**beforeUpdate**周期内旧值和新值不相等时，会重新赋值





```typescript
export const vModelText: ModelDirective<
  HTMLInputElement | HTMLTextAreaElement
> = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el._assign = getModelAssigner(vnode)
    // 元素是否包含number属性
    const castToNumber =
      number || (vnode.props && vnode.props.type === 'number')
    // 事件绑定，lazy修饰符表示走不同的监听方法
    addEventListener(el, lazy ? 'change' : 'input', e => {
      if ((e.target as any).composing) return
      let domValue: string | number = el.value
      // trim修饰符
      if (trim) {
        domValue = domValue.trim()
      }
      // 是否是数字，是数字格式化
      if (castToNumber) {
        domValue = toNumber(domValue)
      }
      el._assign(domValue)
    })
    
    // 包含trim修饰符时，监听change方法同样需要trim
    if (trim) {
      addEventListener(el, 'change', () => {
        el.value = el.value.trim()
      })
    }
    if (!lazy) {
      addEventListener(el, 'compositionstart', onCompositionStart)
      addEventListener(el, 'compositionend', onCompositionEnd)
      // Safari < 10.2 & UIWebView doesn't fire compositionend when
      // switching focus before confirming composition choice
      // this also fixes the issue where some browsers e.g. iOS Chrome
      // fires "change" instead of "input" on autocomplete.
      addEventListener(el, 'change', onCompositionEnd)
    }
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(el, { value }) {
    // 设置初始值
    el.value = value == null ? '' : value
  },
  beforeUpdate(el, { value, modifiers: { lazy, trim, number } }, vnode) {
    el._assign = getModelAssigner(vnode)
    // avoid clearing unresolved text. #2302
    if ((el as any).composing) return
    if (document.activeElement === el && el.type !== 'range') {
      if (lazy) {
        return
      }
      if (trim && el.value.trim() === value) {
        return
      }
      if ((number || el.type === 'number') && toNumber(el.value) === value) {
        return
      }
    }
    const newValue = value == null ? '' : value
    if (el.value !== newValue) {
      el.value = newValue
    }
  }
}

```





### vModelCheckbox



用于checkbox的双向绑定





**created**：进行事件绑定

**mounted**:  设置checked的初始值

**beforeUpdate**: 更新响应事件，设置checked的初始值



```typescript
export const vModelCheckbox: ModelDirective<HTMLInputElement> = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,
  created(el, _, vnode) {
    el._assign = getModelAssigner(vnode)
    addEventListener(el, 'change', () => {
      // model绑定的值
      const modelValue = (el as any)._modelValue
      // 元素上的value值
      const elementValue = getValue(el)
      // checked状态
      const checked = el.checked
      const assign = el._assign
      
      if (isArray(modelValue)) { // 绑定值是数组
        const index = looseIndexOf(modelValue, elementValue)
        const found = index !== -1
        // 当前选中了，但是绑定值中没有，需要插入
        if (checked && !found) {
          // 放入并响应
          assign(modelValue.concat(elementValue))
        } else if (!checked && found) { // 没有选中，但是绑定值中有对应值，则需要删除
          const filtered = [...modelValue] // 复制
          filtered.splice(index, 1) // 删除
          assign(filtered)
        }
      } else if (isSet(modelValue)) { // 绑定值是Set
        const cloned = new Set(modelValue) // 复制
        if (checked) {
          cloned.add(elementValue)
        } else {
          cloned.delete(elementValue)
        }
        assign(cloned)
      } else {
        assign(getCheckboxValue(el, checked))
      }
    })
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el._assign = getModelAssigner(vnode)
    setChecked(el, binding, vnode)
  }
}

function setChecked(
  el: HTMLInputElement,
  { value, oldValue }: DirectiveBinding,
  vnode: VNode
) {
  // store the v-model value on the element so it can be accessed by the
  // change listener.
  // 预先重置元素上的modelValue值
  ;(el as any)._modelValue = value
  if (isArray(value)) {
    el.checked = looseIndexOf(value, vnode.props!.value) > -1
  } else if (isSet(value)) {
    el.checked = value.has(vnode.props!.value)
  } else if (value !== oldValue) {
    el.checked = looseEqual(value, getCheckboxValue(el, true))
  }
}
```



### vModelRadio

和checkbox相比绑定事件内的处理更少了



```typescript
export const vModelRadio: ModelDirective<HTMLInputElement> = {
  created(el, { value }, vnode) {
    el.checked = looseEqual(value, vnode.props!.value)
    el._assign = getModelAssigner(vnode)
    addEventListener(el, 'change', () => {
      el._assign(getValue(el))
    })
  },
  beforeUpdate(el, { value, oldValue }, vnode) {
    el._assign = getModelAssigner(vnode)
    if (value !== oldValue) {
      el.checked = looseEqual(value, vnode.props!.value)
    }
  }
}

```





### vModelSelect







```typescript

export const vModelSelect: ModelDirective<HTMLSelectElement> = {
  // <select multiple> value need to be deep traversed
  deep: true,
  created(el, { value, modifiers: { number } }, vnode) {
    // 是否是Set类型
    const isSetModel = isSet(value)
    addEventListener(el, 'change', () => {
      // 选中的值
      const selectedVal = Array.prototype.filter
      	// filter筛选出所有selected的对象
        .call(el.options, (o: HTMLOptionElement) => o.selected)
        .map((o: HTMLOptionElement) =>
             // 取出其中的值，需要是数字的转换为number类型
          number ? toNumber(getValue(o)) : getValue(o)
        )
      // 调用
      el._assign(
        el.multiple
          ? isSetModel
            ? new Set(selectedVal)
            : selectedVal
          : selectedVal[0]
      )
    })
    el._assign = getModelAssigner(vnode)
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(el, { value }) {
    setSelected(el, value)
  },
  beforeUpdate(el, _binding, vnode) {
    // 更新绑定回调函数
    el._assign = getModelAssigner(vnode)
  },
  updated(el, { value }) {
    setSelected(el, value)
  }
}

// 设置选中
function setSelected(el: HTMLSelectElement, value: any) {
  // 是否多选
  const isMultiple = el.multiple
  
  // 。。。
  
  
  for (let i = 0, l = el.options.length; i < l; i++) {
    const option = el.options[i]
    const optionValue = getValue(option)
    if (isMultiple) {
      if (isArray(value)) {
        // array类型
        option.selected = looseIndexOf(value, optionValue) > -1
      } else {
        // Set类型
        option.selected = value.has(optionValue)
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        // 重新覆盖当前对象上的selectedIndex
        if (el.selectedIndex !== i) el.selectedIndex = i
        return
      }
    }
  }
  if (!isMultiple && el.selectedIndex !== -1) {
    // 默认值-1
    el.selectedIndex = -1
  }
}
```


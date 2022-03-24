---
title: "vue -- ant-design-vue table 可伸缩列"
date: 2022-03-21T20:44:06+08:00
draft: true
tags: ["vue"]
categories: ["vue"]
---

# ant-design-vue table 可伸缩列
由于业务中需要表格伸缩列，在官网文档中也有相关demo, 由于官方文档中使用的方式没有成功，所以自己研究了一套方式

相关基础库
-   `"vue-draggable-resizable": "^2.2.0",`
-    ` "@vue/composition-api": "^1.0.0-beta.17",`
-    `"ant-design-vue": "^1.6.5",`

## 第一步 实现可伸缩列组件

```js
const ResizeableTitle = (h, props, children) => {
  const { onResize, width, isDraggable } = props.props
  if (!width) {
    return <th {...props}>{children}</th>
  }
  console.log(isDraggable)
  return (
    <th key={props.key} class={[props.class, 'resize-table-th']} width={width}>
      {children}
      <vue-draggable-resizable
        key={props.key}
        class-name="table-draggable-handle"
        w={10}
        x={width}
        z={1}
        axis="x"
        draggable={isDraggable}
        resizable={false}
        onDragging={onResize}
      />
    </th>
  )
}
```

##  第二步  在原来table组件的基础上再次封装，方便业务使用
```js
import { defineComponent, reactive, computed } from '@vue/composition-api'
import './index.less'

export default defineComponent({
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    bordered: {
      type: Boolean,
      default: true
    }
  },
  setup (props, ctx) {
    const tableState = reactive({
      size: 'default'
    })

    const draggingMap = {}
    props.columns.forEach(col => {
      draggingMap[col.key] = col.width
    })

    const draggingState = reactive(draggingMap)

    const handleResize = (key) => {
      return (size) => {
        const column = props.columns.find(col => col.key === key)
        column.min = column.width
        draggingState[key] = size
      }
    }

    return () => {
      const columns = props.columns.map((col, idx) => {
        if (col.slots) {
          Object.keys(col.slots).forEach(slotkey => {
            const slotName = col.slots[slotkey]
            if (ctx.slots[slotName]) {
              col[slotkey] = ctx.slots[slotName]()
            }
          })
        }
        const renderFuncName = col.scopedSlots?.customRender
        if (renderFuncName) {
          col.customRender = ctx.slots[renderFuncName]
        }

        return {
          ...col,
          customHeaderCell: column => {
            return {
              props: {
                width: draggingState[column.key],
                isDraggable: true,
                onResize: handleResize(column.key)
              }
            }
          }
        }
      })

      const tableProps = {
        columns,
        dataSource: props.dataSource,
        bordered: props.bordered,
        size: tableState.size,
        rowKey: 'id',
        components: {
          header: {
            cell: ResizeableTitle
          }
        }
      }

      return <div class="vc-table" >
        <a-table {...{ props: tableProps }}></a-table>
      </div>
    }
  }
})

```

- `index.less`

```less
.vc-table {
  .resize-table-th {
    position: relative;
  }

  .table-draggable-handle {
    position: absolute;
    top: 0;
    left: -5px;
    background-color: red;
    cursor: col-resize;
    touch-action: none;
  }
}

```
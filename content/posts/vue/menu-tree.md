---
title: "vue -- 实现MenuTree组件"
date: 2022-08-08T13:30:36+08:00
tags:
categories: ["vue"]
draft: false
---



# vue -- 实现MenuTree组件



## 样例

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a6fb6166f9945deb5445879e2b58574~tplv-k3u1fbpfcp-watermark.image?)



## 具体实现



```vue
<template>
  <div class="Tree-content">
    <div
      v-for="(item, idx) in computedTree"
      :key="idx"
      :class="{
        'Tree-Title': true,
        'Tree-SecondLevelTitle': item.$depth > 0,
        'Tree-FirstLevelTitle': item.$depth == 0,
        active: item.id === computedValue,
      }"
    >
      <div class="Tree-Item" @click="onHandleClick(item)">
        <div class="Tree-ItemTxt">{{ item[computedFieldNames.label] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "menu-tree",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: [String, Number],
    fieldNames: {
      type: Object,
    },
  },
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set(row) {
        this.$emit("change", row.id);
      },
    },
    computedTree() {
      return this.genTree([...this.options]);
    },
    computedFieldNames() {
      return {
        children: "children",
        label: "label",
        key: "key",
        ...(this.fieldNames || {}),
      };
    },
  },
  methods: {
    onHandleClick(row) {
      this.$emit("change", row.id);
    },
    genTree(tree = []) {
      const data = [];
      if (tree.length > 0) {
        this._doLoopTreeWithDepth(tree, 0, data);
      }
      return data;
    },
    _doLoopTreeWithDepth(list, depth = 0, data = []) {
      list.forEach((el, idx) => {
        el.$depth = depth;
        if (!el.id) {
          el.id = `t-${depth}-${idx}`;
        }
        data.push(el);
        if (el[this.computedFieldNames.children]) {
          this._doLoopTreeWithDepth(
            el[this.computedFieldNames.children],
            depth + 1,
            data
          );
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin dot {
  content: " ";
  position: absolute;
  background-color: rgb(133, 144, 166);
  display: inline-block;
  border-radius: 50%;
  top: 12px;
  margin-right: 12px;
}
.Tree {
  &-content {
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    flex-direction: column;
    font-size: 12px;
    display: flex;
  }

  &-Title {
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    flex-shrink: 0;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    color: rgb(133, 144, 166);
    font-size: 12px;
    padding-left: 30px;
    font-weight: 500;
    position: relative;
    height: 30px;
    line-height: 30px;
  }

  &-FirstLevelTitle::before {
    @include dot;
    left: 16px;
    width: 6px;
    height: 6px;
  }
  &-SecondLevelTitle::before {
    @include dot;
    left: 17px;
    width: 4px;
    height: 4px;
  }
  &-FirstLevelTitle,
  &-SecondLevelTitle {
    &::after {
      content: " ";
      display: block;
      position: absolute;
      left: 19px;
      top: 0px;
      transform: translateX(-50%);
      width: 2px;
      height: 40px;
      margin-top: 12px;
      background: rgba(133, 144, 166, 0.12);
    }
    &.active {
      color: rgb(0, 102, 255);
    }
    &.active::before {
      background-color: rgb(0, 102, 255);
    }
  }
  &-Title:last-child::after {
    height: 0px;
  }
  &-Item {
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
    cursor: pointer;
    -webkit-box-align: center;
    align-items: center;
    width: 100%;

    &:hover {
      color: rgb(0, 102, 255);
      background: rgb(235, 235, 235);
      border-radius: 4px;
    }
  }

  &-ItemTxt {
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    pointer-events: none;
    word-break: break-all;
    width: calc(100% - 22px);
  }
}
</style>
```



### 使用方法

```vue
<template>
  <div class="css-box">
    <side-tree v-model="value" :options="tree" @change="onClick"></side-tree>
  </div>
</template>

<script>
import SideTree from "./side-tree.vue";
export default {
  components: {
    SideTree,
  },
  data() {
    return {
      value: 't-1-2',
      tree: [
        {
          label: "零、基础知识",
        },
        {
          label: "一、安装VScode编辑器和MinGW编译器",
          children: [
            {
              label: "1.VScode编辑器",
            },
            {
              label: "1.2.安装VScode扩展插件",
            },
            {
              label: "2.MinGW编译器编译器",
            },
            {
              label: "2.1.下载编译器",
            },
            {
              label: "2.2.安装编译器",
            },
            {
              label: "2.3.编译器验证",
            },
          ],
        },
        {
          label: "二、程序文件的架构",
          children: [
            {
              label: "1.语言学习环境",
            },
            {
              label: "1.1单文件编译运行调试",
            },
            {
              label: "1.2简单多文件编译运行调试",
            },
            {
              label: "2.实际项目开发环境",
            },
          ],
        },
        {
          label: "三、配置一个新项目",
          children: [
            {
              label: "1.创建配置c_cpp_properties.json文件",
            },
            {
              label: "2.创建配置tasks.json文件",
            },
            {
              label: "3.创建配置launch.json文件",
            },
          ],
        },
        {
          label: "四、一些小tips",
          children: [
            {
              label: "1.多文件编译",
            },
            {
              label: "2.中文乱码",
            },
          ],
        },
      ],
    };
  },
  methods: {
    onClick(row) {
      console.log(row);
    },
  },
};
</script>

<style  lang="scss" scoped>
.css-box {
  width: 250px;
  box-sizing: border-box;
  margin: 20px 0px 0px;
  min-width: 0px;
  height: 600px;
  overflow: scroll;
}
</style>
```



### prop



| 参数       | 说明               | 类型                                                        |
| ---------- | ------------------ | ----------------------------------------------------------- |
| v-model    | 值双向绑定         | string\|number                                              |
| value      | 当前值             | string\|number                                              |
| options    | 需要展示的树形数据 |                                                             |
| fieldNames | 绑定数据的属性值   | object\| {children: "children",label: "label",key: "key", } |


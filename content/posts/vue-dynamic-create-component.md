---
title: "vue -- vue3利用createVNode函数，建立命令式调用组件"
date: 2023-08-09T15:26:32+08:00
tags: ["vue3"]
categories: ["vue"]
draft: false

---


# vue3利用createVNode函数，建立命令式调用组件


常规我们使用vue组件都是引用式的，先使用import引用，再在components中注册
最后我们在template中使用

有时候就很难受，因为到处都在import

但是你看`element-plus`的`Message`组件可以直接用js命令式调用，那么我们组件可以做到吗


### 目标组件

比如我们有个目标组件，内部有个drawer，现在我希望在其他外部函数中使用时，直接使用open方法

```vue
<script lang="jsx">
import { defineComponent } from "vue";

export default defineComponent({
  setup(props) {
    return () => {
      return (
        <el-drawer title="Hello world">
          <h1>Dialog</h1>
        </el-drawer>
      );
    };
  },
});
</script>
```


### createVNode

`createVNode` 的函数签名中，
第一个参数可以是动态组件，也可以是类组件，亦或是标签名字符串
第2个参数是props
第3个参数是children

最后返回值是`VNode`格式

```ts

declare function _createVNode(type: VNodeTypes | ClassComponent | typeof NULL_DYNAMIC_COMPONENT, props?: (Data & VNodeProps) | null, children?: unknown, patchFlag?: number, dynamicProps?: string[] | null, isBlockNode?: boolean): VNode;

```

### VNode

VNode中包含`el`属性，其实就是最后生成的dom节点

### render函数

vue中暴露的render函数，可以动态去渲染VNode到具体节点上


```ts
export type RootRenderFunction<HostElement = RendererElement> = (vnode: VNode | null, container: HostElement, isSVG?: boolean) => void;
```


## 实现代码

目标组件

```vue
<script lang="jsx">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    visible: {
      type: Object,
    },
    close: Function,
    destroy: Function
  },
  setup(props) {
    return () => {
      return (
        <el-drawer title="Hello world" v-model={props.visible.value} onClosed={props.destroy}>
          <h1>Dialog</h1>
          <el-button onClick={props.close}>close</el-button>
        </el-drawer>
      );
    };
  },
});
</script>
```


这里`createVNode`传递的props需要传递一个响应式对象进去，如果直接传值，并不能响应

```js
async function createDynamicComponent(instance) {
  const visible = ref(false);

  const open = () => {
    visible.value = true;
  };

  const close = () => {
    visible.value = false;
  };

  const Comp = await import("./components/dialog.vue");

  const container = document.createElement("div");
  container.id = "dialog-container";

  const vnode = createVNode(Comp.default, {
    name: "dy-dialog",
    visible,
    open,
    close,
    destroy: () => {
      container.remove();
    },
  }, null);

  vnode.appContext = instance.appContext;

  watch(visible, () => {
    console.log(`visible.value : ${visible.value}`);
  });

  render(vnode, container);
  instance.vnode.el.appendChild(container);

  return {
    instance: vnode,
    open,
    close,
  };
}
```

具体业务中使用

```js
export default defineComponent({
  setup() {
    const instance = getCurrentInstance();
    const dyComp = ref(null);

    const gotoClick = async () => {
      dyComp.value = await createDynamicComponent(instance);
      dyComp.value.open();
    };
  }
})
```

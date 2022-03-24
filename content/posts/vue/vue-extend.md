---
title: "Vue Extend基础使用"
date: 2022-01-11T10:18:05+08:00
draft: true
---

# Vue.extend

`Vue.extend` 通常我们在js中创建一个Vue子类，方便在其他需要使用的地方注册组件，
日常我们用的vue单文件最终也是编译成`Vue.extend`的形式

伪代码
```js

const comp = Vue.extend()

// js中使用
// mount 中传入需要挂在的容器， 可以是个html标签， 也可以是Dom Element
comp.$mount(/**/)

// vue文件中， components中注册， 模板中一样使用
{
    components: {
        // 注册
    }
}
```

## 研究js中使用

日常我们在做弹窗的时候就需要最动态挂载，现在都是ui框架给我们封装完了，但有些时候需要我们去自定义， 这里我们写一下自己挂载的demo

- 需要往自己组件传入数据的时候，需要在实例化的时候传入 `propsData` 属性， 子组件`props`声明接收

- 如果需要实现响应式数据， 即父组件数据改变的时候，子组件数据同样改变，传入的`propsData`必须是一个<b>*对象*</b>, 基础类型的数据不能实现响应式


## 最终测试代码

```js
import { Button } from "element-ui";
import Vue from "vue";

export default {
  name: "Test",
  data() {
    return {
      state: {
        count: 0,
      },
    };
  },
  methods: {
    addComponent() {
      let target = this.$refs.myEl;
      let source = new MyComponet({
        propsData: {
          outState: this.state,
          increase: () => {
            this.state.count++;
          },
        },
      }).$mount();

      target.appendChild(source.$el);
    },
  },
  render() {
    return (
      <div>
        <h1>outCount: {this.state.count}</h1>

        <div ref="myEl"></div>
        <Button onClick={this.addComponent}>Add</Button>
        <Button
          onClick={() => {
            this.state.count++;
          }}
        >
          Increase
        </Button>
        <Button
          onClick={() => {
            this.state.count--;
          }}
        >
          Decrease
        </Button>
      </div>
    );
  },
};

const MyComponet = Vue.extend({
  props: ["outState", "increase"],
  data() {
    return {
      innerState: 0,
    };
  },
  render() {
    return (
      <div class="border">
        <h2>inner component</h2>
        <div>
          inner: {this.innerState}; out: {this.outState.count};
          <Button
            onClick={() => {
              this.innerState++;
            }}
          >
            Increase Inside
          </Button>
          <Button onClick={this.increase}>Increase</Button>
        </div>
      </div>
    );
  },
});

```


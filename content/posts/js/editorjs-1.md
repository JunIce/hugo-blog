---
title: "Editorjs 1"
date: 2021-11-19T09:07:46+08:00
draft: true
tags: ["js", "源码解读"]
---

# Editorjs 是一个文档编辑器

之前工作中需要开发一个富文本编辑器，所以在github寻找有没有开源的编辑器可以学习，找到这个，虽然没有使用，但是它的代码我们可以学习

## 使用

```ts
var editor = new EditorJS({
  /**
   * Create a holder for the Editor and pass its ID
   */
  holder: "editorjs",

  /**
   * 相关插件
   */
  tools: {
    header: {
      class: Header,
      inlineToolbar: true,
    },
    // ...
  },

  /**
   * Previously saved data that should be rendered
   */
  data: {},
});
```

## codex.ts

代码流程图

![editor.js](/editor.js 流程图.png)
### contructor

```ts
export default class EditorJS {
  constructor(configuration?: EditorConfig | string) {
    // ready 函数回调
    let onReady = (): void => {};
    if (_.isObject(configuration) && _.isFunction(configuration.onReady)) {
      onReady = configuration.onReady;
    }

    // 创建实例
    const editor = new Core(configuration);

    // 由此可以推测出isReady返回的是一个类似Promise的对象
    this.isReady = editor.isReady.then(() => {
      this.exportAPI(editor);
      onReady();
    });
  }

  // 暴露相关api
  public exportAPI(editor: Core): void {
    //
  }
}
```

### exportAPI

```ts
 public exportAPI(editor: Core): void {
    const fieldsToExport = [ 'configuration' ];

    const destroy = (): void => {};

    fieldsToExport.forEach((field) => {
      this[field] = editor[field];
    });

    this.destroy = destroy;

    // 把上面new Core 出来的实例上的相关方法设置到原型上， 这样editor实例上的方法，这里也会有
    Object.setPrototypeOf(this, editor.moduleInstances.API.methods);

    delete this.exportAPI;

    const shorthands = {
      blocks: {
        clear: 'clear',
        render: 'render',
      },
      caret: {
        focus: 'focus',
      },
      events: {
        on: 'on',
        off: 'off',
        emit: 'emit',
      },
      saver: {
        save: 'save',
      },
    };

    Object.entries(shorthands)
      .forEach(([key, methods]) => {
        Object.entries(methods)
          .forEach(([name, alias]) => {
            // 在当前对象上暴露出editor上相关的api方法
            // 即 this.clear = editor.moduleInstances.API.methods.blocks.clear
            this[alias] = editor.moduleInstances.API.methods[key][name];
          });
      });
  }
```
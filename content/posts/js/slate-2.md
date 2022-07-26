---
title: "slate.js 富文本编辑器"
date: 2022-07-24T08:35:32+08:00
tags: ["editor", "slate"]
categories: ["slate"]
draft: false

---



# slate.js



> v0.47

slate是开源社区最新出的一个比较火的可定制化的富文本编辑器

https://github.com/ianstormtaylor/slate

slate 是一个底层核心库，如果要使用，还需要配合slate-react等进行UI部分展示



## 安装

> yarn add slate slate-react



## 使用



slate使用的是基于js对象，通过slate内核进行转换后，用slate-react最终映射到真实dom上



slate传入的初始化的值格式为

```typescript
[
  {
    type: string,
    children: []
  }
]
```



最顶层的type就是paragraph, 表示段落

段落的子元素又是一个个对象，可以用不同的type进行区分，其中children中也可以写入一个text对象，表示当前就是文本节点



### 基础渲染

```tsx
import React, { useMemo, useCallback } from 'react'
import { Editor, BaseEditor } from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor
} from "slate-react";

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [
      {
        text: "With Slate you can build complex block types that have their own embedded content and behaviors, like rendering checkboxes inside check list items!",
      },  
    ],
  },
];

export const App = ({ p }: any) => {
 
  const editor: ReactEditor = useMemo(
    () => withHistory(withReact(createEditor())),
    []
  );

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        placeholder="Get to work…"
      />
    </Slate>
  );
};
```



### 添加监听事件

`slate-react`封装的`Editable`组件就是类似于contenteditable, 其中暴露了一系列的监听事件可以对外使用

```tsx
<Editable
    onKeyDown={event => {
      if (event.key === '&') {
        // 可以监听到对应的值
        event.preventDefault()
        editor.insertText('and')
      }
    }}
/>
```



### 自定义渲染元素

https://docs.slatejs.org/walkthroughs/03-defining-custom-elements

实际在使用过程中富文本编辑器中需要渲染其他效果，比如说高亮，文字加颜色等

Editable组件留下了一个渲染入口，可以根据不同的type去渲染不同的组件



```tsx
const renderElement = useCallback((props: any) => <Element {...props} />, []);



const Element = (
  props: JSX.IntrinsicAttributes & {
    attributes: any;
    children: any;
    element: any;
  }
) => {
  const { attributes, children, element } = props;
	// 根据不同的type类型渲染不同的元素
  switch (element.type) {
    case "check-list-item":
      return <CheckListItemElement {...props} />;
    case "pinyin":
      return <RenderHanzi {...props} />;
    default:
      return <DefaultElement {...attributes}>{children}</DefaultElement>;
  }
};
```



最后在Editable上使用

```tsx
 <Editable
   			// ....
        renderElement={renderElement}
  />
```






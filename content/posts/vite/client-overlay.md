---
title: "vite -- 客户端错误弹窗展示"
date: 2022-06-22T07:26:54+08:00
tags: ["vite", "client"]
categories: ["vite"]
draft: false
---





# Vite client overlay



利用`Custom Component`中的自定义组件，封装了一个自定义的web 标签



```js
export const overlayId = 'vite-error-overlay'
if (customElements && !customElements.get(overlayId)) {
  customElements.define(overlayId, ErrorOverlay)
}
```





## 实例化方法



```js
// 建立标签的根元素
this.root = this.attachShadow({ mode: 'open' })
// 根元素上添加对应的html
this.root.innerHTML = template

codeframeRE.lastIndex = 0
const hasFrame = err.frame && codeframeRE.test(err.frame)
const message = hasFrame
  ? err.message.replace(codeframeRE, '')
  : err.message
// 插件的错误展示
if (err.plugin) {
  this.text('.plugin', `[plugin:${err.plugin}] `)
}
// 写入错误正文
this.text('.message-body', message.trim())

const [file] = (err.loc?.file || err.id || 'unknown file').split(`?`)
// 获取对应的文件
if (err.loc) {
  this.text('.file', `${file}:${err.loc.line}:${err.loc.column}`, true)
} else if (err.id) {
  this.text('.file', file)
}

if (hasFrame) {
  this.text('.frame', err.frame!.trim())
}
// 错误堆栈信息
this.text('.stack', err.stack, true)

// 取消错误的点击冒泡
this.root.querySelector('.window')!.addEventListener('click', (e) => {
  e.stopPropagation()
})
// 关闭事件
this.addEventListener('click', () => {
  this.close()
})
```



## text



此方法是用来找到对应的节点，并且链接到对应的文件

```js
text(selector: string, text: string, linkFiles = false): void {
  // 找到对应元素
  const el = this.root.querySelector(selector)!
  if (!linkFiles) {
    el.textContent = text
  } else {
    let curIndex = 0
    let match: RegExpExecArray | null
    // 循环匹配文件正则，找到匹配的文件
    while ((match = fileRE.exec(text))) {
      const { 0: file, index } = match
      if (index != null) {
        const frag = text.slice(curIndex, index)
        // 插入文本节点
        el.appendChild(document.createTextNode(frag))
        const link = document.createElement('a')
        link.textContent = file
        link.className = 'file-link'
        link.onclick = () => {
          // 跳转到指定文件
          fetch('/__open-in-editor?file=' + encodeURIComponent(file))
        }
        // 插入链接节点
        el.appendChild(link)
        curIndex += frag.length + file.length
      }
    }
  }
}
```




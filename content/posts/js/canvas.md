---
title: "canvas 常见问题总结"
date: 2023-06-09T16:31:19+08:00
draft: true
tags: ["canvas"]
categories: ["canvas"]
---



# canvas 常见问题总结


## 分辨率问题，字体模糊

分辨率这里需要适配设备的显示设备的物理像素分辨率与CSS像素分辨率之比
实际像素需要适配物理像素

```typescript
export function createCanvasCtx({
  width,
  height,
  dpr = window.devicePixelRatio
}: {
  width: number
  height: number
  dpr: number
}): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = width + "px"
  canvas.style.height = height + "px"
  ctx?.scale(dpr, dpr)
  return canvas
}
```


## 点击位置计算

需要考虑滚动条位置

```javascript
editor.clickPoint(clientX + scrollLeft - offsetLeft, clientY + scrollTop - offsetTop)
```
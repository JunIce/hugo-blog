---
title: " 1px 像素问题"
date: 2021-10-19T09:56:39+08:00
draft: true
---

# 移动端 Retina 屏 1px 像素问题

## transform + 伪元素
```CSS
.border-1px:before{
    content: '';
    position: absolute;
    top: 0;
    height: 1px;
    width: 100%;
    background-color: #999;
    transform-origin: 50% 0%;
}
@media only screen and (-webkit-min-device-pixel-ratio:2){
    .border-1px:before{
        transform: scaleY(0.5);
    }
}
@media only screen and (-webkit-min-device-pixel-ratio:3){
    .border-1px:before{
        transform: scaleY(0.33);
    }
}
```

## viewport + rem 实现

```JS
const scale = 1 / window.devicePixelRatio;
const viewport = document.querySelector('meta[name="viewport"]');
if (!viewport) {
    viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    window.document.head.appendChild(viewport);
}

viewport.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale);

// 设置根字体大小
var docEl = document.documentElement; 
var fontsize = 10 * (docEl.clientWidth / 320) + 'px'; 
docEl.style.fontSize = fontsize;

// 在CSS中用rem单位就行了
```

## SVG实现
```css
.svg { 
    border: 1px solid transparent; 
    border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E") 2 2 stretch; 
}
```
---
title: "Css Prefers相关媒体查询@media样式用法"
date: 2021-12-15T21:15:07+08:00
draft: true
---


## CSS 中prefers开头相关媒体查询@media样式用法

这几个css媒体查询样式都是为了增加网站可访问性和健壮性。


### prefers-reduced-motion

减弱动画效果

只有一个取值

> prefers-reduced-motion: reduce;

```css

.animate {
    animate: xxx 5s infinite linear;
}

@media (prefers-reduced-motion: reduce) {
    .animate {
        animate: none;
    }
}

```


### prefers-color-scheme

适配明暗主题，现在系统出了暗黑模式，用于适配操作系统

> prefers-color-scheme: light 明亮模式 \
> prefers-color-scheme: dark  夜间（暗）模式

```css
body {
    background-color: white;
}

@media (prefers-color-scheme: dark) {
    body {
        background-color: black;
    }
}
```

### prefers-contrast

调整色彩对比度

> prefers-contrast: no-preference; 不做处理 \
> prefers-contrast: less; 减少对比度 \
> prefers-contrast: more; 增加对比度 \


```css
.contrast {
  width: 100px;
  height: 100px;
  outline: 2px dashed black;
}

@media (prefers-contrast: high) {
  .contrast {
    outline: 2px solid black;
  }
}
```



### prefers-reduced-transparency

减少页面元素的透明度

取值

> prefers-reduced-transparency: no-preference; 不做处理 \
> prefers-reduced-transparency: reduce; 减少透明度

```css

.transparency {
  opacity: 0.5;
}

@media (prefers-reduced-transparency: reduce) {
  .transparency {
    opacity: 1;
  }
}

```


### prefers-reduced-data

减少数据传输

> prefers-reduced-data: no-preference; 不处理 \
> prefers-reduced-data: reduce; 减少数据传输 \


```css
.container {
    background-image: url(image-100w.jpg);
}

// 降低图片质量
@media (prefers-reduced-data: reduce) {
    .container {
        background-image: url(image-20w.jpg);
    }
}
```


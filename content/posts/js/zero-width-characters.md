---
title: "Zero Width Characters"
date: 2022-07-25T21:30:15+08:00
tags: ["零宽字符"]
categories: ["js"]
draft: false
---



# 零宽字符



所谓零宽字符，就是不可见的「非打印」字符，通过视觉无法看出字符串中是否有零宽字符，但是通过代码遍历，是可以获取到该字符的。



### 零宽字符主要有以下几种

- 零宽度空格符 (zero-width space) U+200B : 用于较长单词的换行分隔
- 零宽度非断空格符 (zero width no-break space) U+FEFF : 用于阻止特定位置的换行分隔
- 零宽度连字符 (zero-width joiner) U+200D : 用于阿拉伯文与印度语系等文字中，使不会发生连字的字符间产生连字效果
- 零宽度断字符 (zero-width non-joiner) U+200C : 用于阿拉伯文，德文，印度语系等文字中，阻止会发生连字的字符间的连字效果
- 左至右符 (left-to-right mark) U+200E : 用于在混合文字方向的多种语言文本中，规定排版文字书写方向为左至右
- 右至左符 (right-to-left mark) U+200F : 用于在混合文字方向的多种语言文本中，规定排版文字书写方向为右至左



### 过滤零宽字符

```typescript
str.replace(/[^\u200b-\u200f\uFEFF\u202a-\u202e]/g, "");
```



```vue
<h1 ref="h1">{{ title }}&zwnj;</h1>


console.log(this.$refs.h1.textContent); // hello 
console.log(this.$refs.h1.textContent.length); // 6
```





### 零宽字符转换网站

https://zws.im/

https://github.com/rover95/morse-encrypt
---
title: "html 相关API整理"
date: 2023-04-23T19:41:19+08:00
draft: true
tags: ["scrollTop"]
categories: ["html"]
---





### document.body.scrollTop、document.documentElement.scrollTop、window.pageYOffset 区别



页面如果指定了`doctype` 使用`document.documentElement.scrollTop`

如果没有， 使用`document.body.scrollTop`


**IE：**

- 没有`doctype`, 使用 `document.body.scrollTop` 或 `document.documentElement.scrollTop`

- 有`doctype` ,  则使用 `document.documentElement.scrollTop`

**Chrome、Firefox：**

- 没有`doctype`，使用 `document.body.scrollTop `

- 有doctype，则使用 `document.documentElement.scrollTop`

**Safari:**

- ` window.pageYOffset`
  


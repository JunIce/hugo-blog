---
title: "请求中获取浏览器推荐语言"
date: 2023-07-27T09:39:16+08:00
draft: false
tags: ["js", "events"]
categories: ["js"]
---

# 请求中获取浏览器推荐语言

```js
let languages: string[] | undefined
// get locale from cookie
const localeCookie = request.cookies.get('locale')
languages = localeCookie?.value ? [localeCookie.value] : []

if (!languages.length) {
// Negotiator expects plain object so we need to transform headers
const negotiatorHeaders: Record<string, string> = {}
request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))
// Use negotiator and intl-localematcher to get best locale
languages = new Negotiator({ headers: negotiatorHeaders }).languages()
}
```
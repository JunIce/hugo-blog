---
title: "URI malformed"
date: 2023-11-13T08:35:32+08:00
tags: ["decodeURIComponent"]
categories: ["js"]
draft: false

---



# url传参出现Uncaught URIError: URI malformed


url加密传参有时候会出现Uncaught URIError: URI malformed的错误，这是因为你的url中包含了“%”字符，浏览器在对“%”执行`decodeURIComponent`时报错，正确的解决是将`%`全部替换为`%25`再进行传输：

```ts
urlStr.replace(/%/g, '%25');
```


## References

[https://juejin.cn/post/7006573468149891103?searchId=20231113161641DF85DD9E3D16C0391C3F](https://juejin.cn/post/7006573468149891103?searchId=20231113161641DF85DD9E3D16C0391C3F)

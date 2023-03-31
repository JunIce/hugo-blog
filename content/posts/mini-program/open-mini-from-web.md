---
title: "小程序 -- 微信外部浏览器或者链接打开方式整理"
date: 2023-03-29T16:39:17+08:00
tags: ["小程序"]
categories: ["小程序"]
draft: false
---



# 小程序从微信外部浏览器或者链接打开



微信现在生成的链接都是30天有效期，不存在长期有效的链接了



## 1. 服务端生成链接



- 每天生成 URL Scheme 和 URL Link 总数量上限为50万



[获取 URL Link | 微信开放文档 (qq.com)](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/url-link/generateUrlLink.html)



通过服务端调用微信api生成链接

```perl
  curl 'https://api.weixin.qq.com/wxa/generate_urllink?access_token=<your accesstoken>' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://api.weixin.qq.com' \
  --data-raw {"path":"pages/tabbar/index/index","query":"","is_expire":false} \
  -H 'Content-Type: application/json' \
 --compressed
```



返回结果

```json
{
    errcode: 0,
    errmsg: "ok",
    url_link: "https://wxaurl.cn/U6Fqmy2",
}
```



## 2. 部署微信的静态网站

部署云静态网站， 19元/月

好处是你可以定义跳转的那个页面的样式



[静态网站 H5 跳小程序 | 微信开放文档 (qq.com)](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/staticstorage/jump-miniprogram.html)



通过云函数的形式进行跳转， 也没有50万限制了
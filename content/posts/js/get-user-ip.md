---
title: "JS -- 获取访问用户IP所在的省市区"
date: 2021-10-20T09:20:10+08:00
draft: true
tags: ["js", "nodejs"]
---

## 获取访问用户IP所在的省市区

```js
function get_ip(cb) {
    var script = document.createElement("script"),
        s  = document.getElementsByTagName("script")[0];
           
    script.src = "http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=jsonp";
    s.parentNode.insertBefore(script, s);
    
    var it = setInterval(function () {
        if (!!remote_ip_info) {
            cb(remote_ip_info);
            remote_ip_info = null;
            
            clearInterval(it);
            it = null;
        }
    }, 100);
}

get_ip(function (info) {
    alert('你的ip所在地为:' + info.country + info.province + info.city);
});
```
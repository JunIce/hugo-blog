---
title: "Axios 中 Cookie 操作及代码详解"
date: 2021-11-15T10:48:01+08:00
draft: false
---


> 1)Cookie名称，Cookie名称必须使用只能用在URL中的字符，一般用字母及数字，不能包含特殊字符，如有特殊字符想要转码。如js操作cookie的时候可以使用escape()对名称转码。
> 2)Cookie值，Cookie值同理Cookie的名称，可以进行转码和加密。
> 3)Expires，过期日期，一个GMT格式的时间，当过了这个日期之后，浏览器就会将这个Cookie删除掉，当不设置这个的时候，Cookie在浏览器关闭后消失。
> 4)Path，一个路径，在这个路径下面的页面才可以访问该Cookie，一般设为“/”，以表示同一个站点的所有页面都可以访问这个Cookie。
> 5)Domain，子域，指定在该子域下才可以访问Cookie，例如要让Cookie在a.test.com下可以访问，但在b.test.com下不能访问，则可将domain设置成a.test.com。
> 6)Secure，安全性，指定Cookie是否只能通过https协议访问，一般的Cookie使用HTTP协议既可访问，如果设置了Secure（没有值），则只有当使用https协议连接时cookie才可以被页面访问。
> 7)HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息。

```js
function doCookie() {
  return {
    write: function write(name, value, expires, path, domain, secure) {
      var cookie = [];
      cookie.push(name + "=" + encodeURIComponent(value));

      if (utils.isNumber(expires)) {
        cookie.push("expires=" + new Date(expires).toGMTString());
      }

      if (utils.isString(path)) {
        cookie.push("path=" + path);
      }

      if (utils.isString(domain)) {
        cookie.push("domain=" + domain);
      }

      if (secure === true) {
        cookie.push("secure");
      }

      document.cookie = cookie.join("; ");
    },

    read: function read(name) {
      var match = document.cookie.match(
        new RegExp("(^|;\\s*)(" + name + ")=([^;]*)")
      );
      return match ? decodeURIComponent(match[3]) : null;
    },

    remove: function remove(name) {
      this.write(name, "", Date.now() - 86400000);
    },
  };
}
```

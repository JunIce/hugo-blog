---
title: "Caddy "
date: 2022-06-01T08:46:48+08:00
tags:
categories: ["tools"]
draft: false

---





# caddy

是一个类似于nginx的web服务器，只不过是用`Go`写的，在配置上，要比nginx配置更简单，配置文件使用`caddyfile`， 默认开箱就是支持`https`的



## 下载



[Download Caddy (caddyserver.com)](https://caddyserver.com/download)



## 安装

[Install — Caddy Documentation (caddyserver.com)](https://caddyserver.com/docs/install)



### windows

下载指定打包后的exe文件，放到system32目录下，就能在终端中使用了



> // 格式化
>
> caddy fmt
>
>  // 前台运行
>
> caddy run
>
>  // 后台运行
>
> caddy start



## caddyfile语法



- 一个可选的全局配置块需要在文件的最上方
- 否则，文件的最上方总是服务的地址`address`
- 所有的指令和匹配器必须放在网站块中，这里没有全局scope或者通过网站块继承
- 如果只有一个网站块， `{}`就是可选的





## usage



配置目录下新建文件名为`Caddyfile`的文件，`caddy`区别于`nginx`最大的特点就是配置文件简单，对于新手来说非常友好



```caddyfile
localhost
respond "hello caddy1"
```



配置文件目录下执行`caddy run`,就可以看到在控制台里有日志打印记录



![微信截图_20220602205041.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0382ce2ef1848ce80579a56af7127d6~tplv-k3u1fbpfcp-watermark.image?)



其中看到`localhost:2019`什么的，其实是当前caddy服务的端口

浏览器中输入`localhost:2019/config`，能看到当前`caddyfile`最终转换成的json配置文件





配置文件中第一行是`localhost`

浏览器中输入localhost, 最终就是返回我们第二行输入的respond出来的字符串



这里我们就能看到，caddy作为一个正向代理，反向代理，最合适不过了



### 接口代理



新建一个模拟接口

```javascript
const http = require("http")


const app = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: 'Hello World!'
    }));
})


app.listen("3000", () => {
    console.log("listening at port 3000");
})
```



现在接口地址是3000端口， 访问3000时，会返回data



现在有个需求，需要访问8001端口时，代理到3000端口上



```caddyfile
:8001 {
    reverse_proxy http://localhost:3000
}
```



两三行解决，第一块是写的`:8001`加一个大括号， 即默认是`localhost:8001`, 大括号即是`site block`

可以在同一个配置文件中写多个网站的配置代理

`reverse_proxy`: 代理的指令



> reverse_proxy /api/* http://localhost:3000



即把所有的`/api`路由结尾的都代理到3000端口

相比于之前的nginx，或者说webpack中的devServer配置代理的操作，都简化了不少



### 添加自定义请求header



```
:8001 {
    header Custom-Header "caddy-server"
    reverse_proxy http://localhost:3000
}
```



配置中自定义添加header指令，就能添加自定义请求头了



![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff5e610b70f047d1a1259640ee86ea61~tplv-k3u1fbpfcp-watermark.image?)





`header Location http:// https://`



替换header中location  http为https





### 静态文件服务



```
:8001 {
    file_server browse
}
```



`file_server`是一个文件服务的指令， 加上`browse`, 就是文件列表可视化，搭一个简易的文件服务，美滋滋



![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea103b220f1044dabd12701a1d3766ea~tplv-k3u1fbpfcp-watermark.image?)




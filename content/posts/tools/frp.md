---
title: "go Frp 工具使用"
date: 2021-11-18T11:06:53+08:00
draft: false
tags: ["工具", "go"]
---

## frp使用

[frp](https://gofrp.org/docs/)是golang开发的内网穿透工具，日常我们本地的服务由于公网ip不固定，外网无法访问，有了内网穿透工具，就可以很轻松的把我们的服务暴露给外网使用。

## 下载

[https://github.com/fatedier/frp/releases](https://github.com/fatedier/frp/releases)

这里我下载的是`linux_amd64`版本，根据自己需要下载

## 使用

frp分为服务端和客户端

![Alt text](http://cdn.storycn.cn/frp-demo.png)

> 解压后 `frp` + `s` 即 `server` \
> 解压后 `frp` + `c` 即 `client`

其中`.ini`为配置文件

### frps.ini


```ini
[common]
bind_port = 7000 # frp 服务端暴露端口
vhost_http_port = 8099 # frp 客户端监听端口
```

### frpc.ini


```ini
[common]
server_addr = your.remote.ip # 你的服务器ip
server_port = 7000 # 暴露端口

[web]
type = http # 类型
local_port = 8099 # 客户端端口
custom_domains = your.domain # 自定义域名
```

我们在 客户端上起一个服务


```js
const http = require('http')

http.createServer(function(req, res){
   res.writeHead(200, { 'content-type': 'application/json' })
   res.end(JSON.stringify({
      data: 'success',
      code: 200
   }))
})
.listen(8099, function() {
    console.log(`listening at port 8099`)
})
```

在其他机器上访问 `http://your.domain:8099` 即可访问到原本本地的web服务


### 加入到系统命令中

`systemd`目录为自动脚本， 即linux中 `service` 命令对应的脚本

以`frps`为例

- 把可执行脚本`frp` 移动到 `/usr/bin`目录下

> $ mv ./frps /usr/bin

- 创建`frp`配置目录， 把 `frps.ini` 移动到该目录下

> $ mkdir /etc/frp && mv frps.ini /etc/frp

- 把相关自动执行脚本移动到`systemd/system`目录下

> $ cd systemd && mv frps*service /etc/systemd/system

- 启动

> $ service frps start 


---
title: "linux -- curl命令"
date: 2022-01-24T10:31:25+08:00
draft: true
---


# curl

## 参数

- -A 指定User-Agent
- -b 发送Cookie
- -c Cookie写入文件
- -D 输出响应标头
- -d 发送请求对，默认发送POST请求，且HTTP 请求加上标头【Content-Type : application/x-www-form-urlencoded】，【-G】可以覆盖默认设置
--data-urlencode 类似-d，数据会进行URL编码
- -e 设置Referer
- -F 上传二进制文件，HTTP 请求加上标头【Content-Type: multipart/form-data】
- -G 发送GET请求
- -H 添加HTTP请求的标头
- --head 等同于【-I】
- -i 打印服务器返回的HTTP标头
- -I 向服务器发送HEAD请求
- -L HTTP请求跟随服务器的重定向，默认不重定向
- --limit-rate 限制带宽
- -m 设置超时时间
- -M 显示curl手册
- -o 【文件名】服务器的回应保存成文件
- -O 服务器的回应保存成文件，自动命名
- -s 安静模式
- -S 覆盖-s，输出错误信息
- -T 上传文件
- -u 设置登录用户名和密码
- -v 输出通信整个过程
- -x 指定HTTP请求的代理
- -X 指定HTTP请求方法

## curl 发送get请求

```sh
curl -G "https://www.baidu.com"
```

## curl 发送post请求

```sh
curl -H "Content-Type:application/json" -X POST -d '{"service":10,"partId":"2354325235"}' 'http://www.baidu.ad/getapi'
```


## curl 测试websockt

```sh
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Host: echo.websocket.org" -H "Origin: http://www.websocket.org" http://echo.websocket.org
```

```sh
curl --include \
     --no-buffer \
     --header "Connection: Upgrade" \
     --header "Upgrade: websocket" \
     --header "Host: example.com:80" \
     --header "Origin: https://example.com:80" \
     --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
     --header "Sec-WebSocket-Version: 13" \
     https://example.com:80/
```


---
title: "最新宝塔部署thinkphp项目"
date: 2023-07-29T17:22:36+08:00
tags: ["php"]
categories: ["php"]
draft: true
---



# 最新宝塔部署`thinkphp`项目





## 1.建立网站目录

创建网站目录，这里看情况填写相关信息

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02ce183fb66c4b22a3be242aebca10c3~tplv-k3u1fbpfcp-watermark.image?)



## 2. 文件项目目录下面上传项目文件



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f5c988f48f64d288cbabaf984fb9f0b~tplv-k3u1fbpfcp-watermark.image?)



如果是压缩包 

命令行输入命令进行解压

```bash
tar -zxvf 客服备份.tar.gz
```



## 3. 站点设置



### 运行目录



这里把运行目录指向`public`目录

![image-20230731100247185.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8260a3071a145ec80bdb13f1b00f040~tplv-k3u1fbpfcp-watermark.image?)





### 伪静态

伪静态设置到`thinkphp`，会自动带出`thinkphp`的配置，保存

![image-20230731100454917.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e36133487100433e86066e803ae72fc4~tplv-k3u1fbpfcp-watermark.image?)





### 证书



证书申请的话，宝塔有自带的免费证书，一键申请

很方便



宝塔申请的证书服务器目录， 应该都是一样的

```bash
/www/server/panel/vhost/cert/
```



![image-20230731100646641.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d645686533f4d9f9c33d2fd1d8891f7~tplv-k3u1fbpfcp-watermark.image?)





### 数据库配置



修改数据库链接配置

`/www/wwwroot/站点名/config/database.php`

![image-20230731101057211.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bb11f04fb8b4988832e990761d6ed62~tplv-k3u1fbpfcp-watermark.image?)





**到这。**

一个常规的thinkphp站点应该就可以跑起来了



## websocket链接



如果你还有类似`websocket`的服务



这里直接配置`nginx`进行转发

修改伪静态的配置，其实就是修改的`nginx`配置



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fee900029062433f8bbdd2eafd86e789~tplv-k3u1fbpfcp-watermark.image?)





这里我`weboscket`的服务是**2020**端口



```nginx
location ~* (runtime|application)/{
	return 403;
}
location /wss{
  proxy_pass http://0.0.0.0:2020;     
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "Upgrade";
  proxy_set_header X-Real-IP $remote_addr;
}
location / {
	if (!-e $request_filename){
		rewrite  ^(.*)$  /index.php?s=$1  last;   break;
	}
}
```


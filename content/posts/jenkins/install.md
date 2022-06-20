---
title: "jenkins docker安装说明"
date: 2022-06-19T15:48:01+08:00
tags:
categories: ["Jenkins"]
draft: false
---





# 安装



以docker部署jenkins为例



- 拉取镜像

```bash
docker pull jenkinsci/blueocean
```



- 运行

```bash
docker run \
  -u root \
  --name jenkins
  -p 8080:8080 \
  -v /data/jenkins-data:/var/jenkins_home \ 
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkinsci/blueocean
```



1. 把8080端口映射到宿主8080端口
2. /var/jenkins_home 映射到宿主 /data/jenkins-data
3. /var/run/docker.sock 把宿主的docker运行脚本映射进去
4. 命名容器的名称为jenkins







容器启动起来以后，可以看到初始密码



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2bbe60c198f74f749b0db495dd63003b~tplv-k3u1fbpfcp-watermark.image?)





## 安装nodejs插件



1. 先到插件管理下面搜索nodejs插件并安装
2. /configureTools下配置nodejs版本，并且勾选自动安装

>  "Manage Jenkins" -> "Global Tool Configuration" -> "Add NodeJS"





## Git ssh



配置git ssh



1. 命令行中生成ssh key

   > ssh-keygen -f ~/.ssh/jenkins_agent_key

2. 回到`jenkins`中， 找到`Manage Credentials `， 添加一个新的全局凭证

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41e4196cf99847abaae40f770e4a8cbf~tplv-k3u1fbpfcp-watermark.image?)



3. 在输入框中输入**ssh**生成的**`private_key`**





### 配置插件清华源



https://mirrors.tuna.tsinghua.edu.cn/jenkins/



1. 在jenkins插件管理页面，找到高级tab

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a395c9fa6ddd4a20b9838f4129201b56~tplv-k3u1fbpfcp-watermark.image?)



2. 输入清华源的升级json

https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/231a9ffdf8f148b6b4220c6ba7380d42~tplv-k3u1fbpfcp-watermark.image?)

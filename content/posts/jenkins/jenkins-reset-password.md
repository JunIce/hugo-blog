---
title: "jenkins忘记密码后重置或找回密码"
date: 2021-09-28T21:26:52+08:00
draft: false
tags: ["jenkins", "linux"]
categories: ["jenkins"]
---





# Jenkins 忘记密码后重置或找回密码



### 方法1

找到`jenkins`home目录中的`config.xml`把其中

```xml
<useSecurity>false</useSecurity>
```

`false` 改为 `true`

家目录正常在

- /var/lib/jenkins
- ~/.jenkins
- /var/jenkins_home

### 方法2
输出的就是密码
```sh
cat /var/lib/jenkins/secrects/initialAdminPassword
```

### 方法3

```sh
cd /var/lib/jenkins/users/admin_xxxxxx
```
替换其中

```xml
<passwordHash>#jbcrypt:$2a$10$F3FuCma14yxF5zVAxelffez7oZoCZzW5Iau/LS5DIvmzugazYZSSS</passwordHash>
```

为

```xml
<passwordHash>#jbcrypt:$2a$10$4NW.9hNVyltZlHzrNOOjlOgfGrGUkZEpBfhkaUrb7ODQKBVmKRcmK</passwordHash>
```

新密码为123456

### 方法4



- 删除`config.xml`中相关参数

```xml
<useSecurity>true</useSecurity>
<authorizationStrategy class="hudson.security.FullControlOnceLoggedInAuthorizationStrategy">
<denyAnonymousReadAccess>true</denyAnonymousReadAccess>
</authorizationStrategy>
<securityRealm class="hudson.security.HudsonPrivateSecurityRealm">
<disableSignup>true</disableSignup>
<enableCaptcha>false</enableCaptcha>
</securityRealm>
```



- 重启服务
- 菜单 -> 管理 -> 全局安全配置

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93379f1e6d6a43828834bdeae542a16a~tplv-k3u1fbpfcp-watermark.image?)



- 设置后重新注册**新用户**

- 重新改回`config.xml`

- 重启

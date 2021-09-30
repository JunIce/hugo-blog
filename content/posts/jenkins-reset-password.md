---
title: "Jenkins忘记密码后重置或找回密码"
date: 2021-09-28T21:26:52+08:00
draft: false
tags: ["jenkins", "linux"]
---

## Jenkins忘记密码后重置或找回密码

### 方法1

找到`jenkins`家目录中的`config.xml`把其中

```xml
<useSecurity>false</useSecurity>
```

`false` 改为 `true`

家目录正常在

- /var/lib/jenkins
- ~/.jenkins

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



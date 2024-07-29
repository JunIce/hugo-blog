---
title: "sshpass 使用"
date: 2024-07-29T08:29:26+08:00
tags: ["sshpass", "shell"]
categories: ["shell"]
draft: false
---



# sshpass 使用



在提供的文档中，提到了使用 sshpass 来实现自动化部署。sshpass 是一个非交互式 SSH 密码认证工具，它允许你通过命令行传递密码，从而实现自动化脚本中的 SSH 登录。

以下是文档中提到的 sshpass 的用法示例：

1. **安装 sshpass**：

   - 在 Linux 系统中，可以通过包管理器安装`sshpass`

     。例如，在 Ubuntu 或 Debian 上，可以使用以下命令：

     ```bash
     sudo apt-get install sshpass
     ```

2. **使用 sshpass 进行 SSH 登录**：

   - 使用`sshpass`可以通过命令行传递密码来登录服务器。示例如下：

     ```bash
     sshpass -p 'your_password' ssh user@host
     ```

3. **在脚本中使用 sshpass**：

   - 在自动化脚本中，可以将`sshpass`与`scp`或`ssh`命令结合使用，实现文件传输和命令执行。示例如下：

     ```bash
     sshpass -p 'your_password' scp -P port file_to_transfer user@host:/path/to/destination
     sshpass -p 'your_password' ssh -p port user@host 'command_to_execute'
     ```

4. **在 package.json 中使用 sshpass**：

   - 可以将`sshpass`命令集成到`package.json`的脚本中，以便通过 npm 脚本执行。示例如下：

     ```json
     {
       "scripts": {
         "ssh:dev": "sshpass -p 'your_password' scp -P port file_to_transfer user@host:/path/to/destination"
       }
     }
     ```

5. **安全注意事项**：

   - 将密码直接写在脚本中是不安全的，建议使用 SSH 密钥认证或配置免密码登录。
   - 如果必须使用密码，可以考虑使用环境变量或其他安全方式传递密码。

文档中还提到了一些具体的命令和脚本示例，例如：

```bash
#!/bin/bash

# 定义打包的项目
project=$1 # 接受项目名称参数
if [ ! $project ]; then
echo "请输入部署的项目"
exit
fi

# 全局参数
homeDir=/usr/local/nginx/html
host=xxxx
port=xxxx
user=xxxx
password=xxxx

# 打包项目
echo "开始打包项目"
cd out
tar -zcvf $project.tar.gz $project/

# 上传代码并进入服务器中
sshpass -p $password scp -P $port $project.tar.gz $user@$host:$homeDir
sshpass -p $password ssh -p $port $user@$host "cd $homeDir && tar -zxvf $project.tar.gz && chown -R root:root $project && chmod -R 755 $project && rm -f $project.tar.gz"

echo "部署完成"
exit
```
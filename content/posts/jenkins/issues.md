---
title: "jenkins docker部署问题搜集"
date: 2022-06-19T16:47:56+08:00
tags:
categories: ['Jenkins']
draft: false
---









## node command not found



`jenkinsci/blueocean`使用后发现安装的nodejs版本无法使用，node命令无法找到



因为在`docker-apline`镜像中存在`node`依赖问题



https://stackoverflow.com/questions/43307107/jenkins-nodejsplugin-node-command-not-found



解决方案是使用官方的镜像https://hub.docker.com/r/jenkins/jenkins
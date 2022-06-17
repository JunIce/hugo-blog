---
title: "windows下docker运行jenkins"
date: 2022-06-17T13:07:00+08:00
tags:
categories:
draft: false
---





# windows下docker运行jenkins



## image



> docker pull jenkinsci/blueocean 



## run



> docker run --name jenkinsci-blueocean -u root --rm  -d -p 7005:8080 -p 50000:50000 -v D:\workspace\jenkinsData:/var/jenkins_home jenkinsci/blueocean
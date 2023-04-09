---
title: "go 使用中问题"
date: 2023-04-08T20:59:54+08:00
draft: true
tags: ["go"]
categories: ["go"]
---




### package io/fs is not in GOROOT while building the go project

go版本过低，要使用高版本golang



### coding 中升级jenkins

```yaml
stage('更新golang'){
	steps {
		sh 'wget https://go.dev/dl/go1.20.3.linux-amd64.tar.gz'
		sh 'rm -fr /root/programs/go && tar -C /root/programs -xzf go1.20.3.linux-amd64.tar.gz'
		sh 'go env && go version'
	}
}
```


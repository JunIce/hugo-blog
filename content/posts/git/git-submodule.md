---
title: "git submodule 使用方法"
date: 2021-09-18T13:20:55+08:00
draft: false
tags: ["git"]
---



# submodule



平时我们在管理项目的时候都是用git来进行管理，git管理很方便，但是一旦项目越来越大，单个git仓库管理起来就没有那么方便了
这个时候我们就可以使用git的另一个工具submodule来管理我们的项目

submodule 是用来管理主项目和子项目之间的关系。



## 使用



```sh
git submodule add <submodule_url>
```


此时主项目中会多出一个文件`.gitmodules`，此文件是用来管理子模块的



以此博客为例

```.git
[submodule "themes/LoveIt"]
	path = themes/LoveIt
	url = https://github.com/dillonzq/LoveIt.git
```


## 安装

平时我们`clone`项目都是使用`git clone xxx`下载项目，如果项目中有子模块，这种方式就不能下载下来了

如果希望子模块代码也获取到，一种方式是在克隆主项目的时候带上参数 `--recurse-submodules`，这样会递归地将项目中所有子模块的代码拉取。

另一种方式

`git submodule init && git submodule update`







### 更新所有模块

```bash
git submodule foreach 'git pull origin master'
```

```bash
git submodule update --init --recursive --remote
```



### 单独更新一个子模块



```bash
git submodule update --init --remote a/submodule/path
```



### 删除某个子模块

`git submodule deinit project-sub-1`

`git rm project-sub-1`





## issues



#### 1.版本跟踪里出现`git submodule commit xxxxx`错误



解决方法

> git submodule update


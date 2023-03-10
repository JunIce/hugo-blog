---
title: "nuxt -- docker-compose进行部署"
date: 2023-03-10T15:26:32+08:00
tags: ["nuxt", "docker-compose"]
categories: ["nuxt"]
draft: false
---





# nuxt -- docker-compose进行部署



nuxt是社区一个比较流行的vue ssr项目，ssr指的就是服务端渲染，这里我们在写完代码的时候就要学会部署到服务器上，大部分公司现在都会使用docker进行部署，docker部署的好处就是方便部署，方便配合使用CD&&CI和扩容等。。所以前端学习一下docker，或者说了解一下，在配合起来效率就更高了



## 创建nuxt项目



创建指南

https://nuxt.com/docs/getting-started/installation



第一步创建一个空项目



> npx nuxt init project
>
> cd project && pnpm install



写你的业务代码....



![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dd920763f3f477b893c0f0b421af64d~tplv-k3u1fbpfcp-watermark.image?)



当我们要进行部署的时候需要先进行build



> pnpm build



在使用node进行启动



> pnpm start



这里其实最终运行的是output下面的一个服务



> node .output/server/index.mjs



下面我们开始使用docker进行部署



## Dockerfile编写



- 第一步：我们需要有一个node镜像
- 第二步：把项目复制进去
- 第三步：install 并且 build
- 第四步：启动 也就是运行 `pnpm start`



这里我根据上面的思路写的dockerfile， 这边的一些关键词，可以到docker官方文档上去学习一下

https://docs.docker.com/engine/reference/builder/



项目**根目录**下新建文件Dockerfile



```dockerfile
FROM node:18.14.2-slim

RUN mkdir -p /var/www/nuxt-app
WORKDIR /var/www/nuxt-app

COPY package*.json ./
RUN yarn install --registry=https://registry.npmmirror.com

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["npm", "run", "start"]
```



命令行运行

> docker build -t nuxt-ssr .



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23f6066979ac4892917c778be42a8dd2~tplv-k3u1fbpfcp-watermark.image?)



这样就镜像就构建成功了

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b153df2ce8cf4dd39396f3ee306e1946~tplv-k3u1fbpfcp-watermark.image?)



`docker images `可看到所有镜像



运行镜像



> docker run -p 8001:3000 --name=nuxt-demo -d nuxt-ssr



![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3beb75e55b8949a891b94e60ddb1dd63~tplv-k3u1fbpfcp-watermark.image?)



看到这样就是成功了



可以访问本地的`http://localhost:8001/`看看是否成功



也可以查看容器日志

> docker logs nuxt-demo

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fbc848e7881448bdb707dc30cbc5ad58~tplv-k3u1fbpfcp-watermark.image?)

这样就是成功了





## docker-compose



docker-compose干什么的就解释了，可以找一下官方文档



这里直接写一下docker-compose的配置文件

**新建文件`docker-compose.yml`**

`docker-compose.yml`

```yaml
version: '3'
services:
  nuxt-app:
    build: 
      context: .
      dockerfile: "./Dockerfile"

    container_name: "nuxt-demo"
    ports:
      - 8001:3000

    command: ["npm", "run", "start"]
    networks:
      - nuxt-networks

networks:
  nuxt-networks:
```



> docker-compose up



就可以在命令行中看到帮助我们新建完镜像并且启动服务了





到这里就结束了吗？ 

。。。。





我这里一行都没写，就占用磁盘1个多G了



## 优化





### 镜像大小

- 排除一些不需要的复制进镜像的目录

新建`.dockerignore`文件，使用方法和`.gitignore`差不多

```perl
node_modules
.nuxt
.output
```



排除非使用目录



- 分步构建镜像



具体的docker分步的细节，可以到文档上研究研究



我们最终运行的其实只需要.output那个目录的东西，这里我们就先构建build完，在构建一个只有output目录的镜像，这样不就小了吗

```dockerfile
FROM node:18.14.2-slim as Builder

RUN mkdir -p /var/www/nuxt-app
WORKDIR /var/www/nuxt-app

COPY package*.json ./
RUN yarn install --registry=https://registry.npmmirror.com

COPY . .

RUN yarn build


FROM node:18.14.2-slim

EXPOSE 4000

ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=4000

RUN mkdir -p /var/www/nuxt-app
WORKDIR /var/www/nuxt-app

COPY --from=Builder /var/www/nuxt-app/.output /var/www/nuxt-app

CMD [ "node", "./server/index.mjs" ]
```



![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5782c528e9d4b83961716a4dde1a582~tplv-k3u1fbpfcp-watermark.image?)



最终镜像这才是正常的😊





### 环境变量

原来我们的代码都是直接打包进去的

现在如果我希望是镜像启动运行时控制咋办



很自然就是想到使用环境变量



这里我们以启动的端口为例



在`dockerfile`中添加`ENV`参数

```dockerfile
ENV NITRO_PORT=4000
```

这里启动时默认给了就是4000端口



先用docker run启动试试

>  docker run -p 4001:4032 -e NITRO_PORT=4032 -d 32fb53d4a78d



最后的镜像ID，你可以替换成名字或者你build出来的id

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92c63426702d4f21a4bf1e76f78b5824~tplv-k3u1fbpfcp-watermark.image?)

可以看到是正常运行的，而且端口也进行了重新映射

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6aecebb1a79d4857ab72a64ff10bcd8e~tplv-k3u1fbpfcp-watermark.image?)



#### docker-compose

`docker-compose.yml`配置文件中添加`env`配置

这里我又重新配置了端口为5000，并且暴露外部端口为5001



```yaml
version: '3'
services:
  nuxt-app:
    build: 
      context: .
      dockerfile: "./Dockerfile"

    container_name: "nuxt-demo"
    environment:
      NITRO_PORT: 5000
    ports:
      - 5001:5000

    command: ["node", "./server/index.mjs"]
    networks:
      - nuxt-networks

networks:
  nuxt-networks:
```



访问本机5001端口， Bingo！🎉🎉🎉





谢谢各位观众姥爷！！！
















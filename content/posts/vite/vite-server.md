---
title: "Vite Server端源码"
date: 2022-05-11T15:03:29+08:00
tags: ["vite", "websockt"]
categories: ["vite"]
draft: false
---

# Vite server

> 2.9.8



`packages/vite/src/node/server/index.ts`



## createServer



### 关键步骤



1. 解析配置文件

   ```typescript
   const config = await resolveConfig(inlineConfig, 'serve', 'development')
   ```

   

2. 创建中间件的容器，使用的第三方库`connect`, 默认可以兼容`express`、`koa`等第三方node服务库， 后续会把相应的中间件加入到实例中

   ```typescript
     const middlewares = connect() as Connect.Server
   ```

   

3. 创建httpServer实例，使用的是node原生`http`库

   ```typescript
    const httpServer = middlewareMode
       ? null
       : await resolveHttpServer(serverConfig, middlewares, httpsOptions)
   ```

   

4. 创建出一个`websocket`实例，使用第三方库`ws`

   ```typescript
     const ws = createWebSocketServer(httpServer, config, httpsOptions)
   ```

   

5. 创建出一个文件夹监听实例，使用第三方库`chokidar`,  监听目标目录下文件的变动， 也就是对应的热更新操作

   ```typescript
     const watcher = chokidar.watch(path.resolve(root), {
       ignored: [
         '**/node_modules/**',
         '**/.git/**',
         ...(Array.isArray(ignored) ? ignored : [ignored])
       ],
       ignoreInitial: true,
       ignorePermissionErrors: true,
       disableGlobbing: true,
       ...watchOptions
     }) as FSWatcher
   ```

   

6. 创建模块依赖`moduleGraph`,记录文件模块依赖

   ```typescript
   const moduleGraph: ModuleGraph = new ModuleGraph((url, ssr) =>
   	container.resolveId(url, undefined, { ssr })
   )
   const container = await createPluginContainer(config, moduleGraph, watcher)
   ```

   

7. 构建一个`server`对象，包括当前上下文的参数等等

   ```typescript
    const server: ViteDevServer = {
    	// ....
    }
   ```

   

8. 返回`server`给外部使用




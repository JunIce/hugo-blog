---
title: "vite--server对应源码"
date: 2022-05-11T15:03:29+08:00
tags: ["vite", "websockt"]
categories: ["vite"]
draft: false
---



# vite server



> 3.0.0



## 源码位置



`packages/vite/src/node/server/index.ts`



## createServer



步骤



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

   构建插件容器

   ```typescript
   const moduleGraph: ModuleGraph = new ModuleGraph((url, ssr) =>
   	container.resolveId(url, undefined, { ssr })
   )
   const container = await createPluginContainer(config, moduleGraph, watcher)
   ```

   

7. 构建一个`server`对象，包括当前上下文的参数等等

   交给后续上下文使用

   ```typescript
    const server: ViteDevServer = {
    	// ....
    }
   ```

8. 监听文件的变化、新增、删除等操作,  会进行相应的热更新操作

   ```typescript
   watcher.on('change', async (file) => {
       file = normalizePath(file)
       if (file.endsWith('/package.json')) {
         return invalidatePackageData(packageCache, file)
       }
       // invalidate module graph cache on file change
       // 模块依赖更新
       moduleGraph.onFileChange(file)
       if (serverConfig.hmr !== false) {
         try {
           // 热更新操作
           await handleHMRUpdate(file, server)
         } catch (err) {
           ws.send({
             type: 'error',
             err: prepareError(err)
           })
         }
       }
     })
   
     watcher.on('add', (file) => {
       handleFileAddUnlink(normalizePath(file), server)
     })
     watcher.on('unlink', (file) => {
       handleFileAddUnlink(normalizePath(file), server)
     })
   ```

9. 遍历所有的插件，同步拿到配置服务的结果

   ```typescript
     const postHooks: ((() => void) | void)[] = []
     for (const plugin of config.plugins) {
       if (plugin.configureServer) {
         postHooks.push(await plugin.configureServer(server))
       }
     }
   ```

10. 在服务中间件中添加一些列的中间件，包括请求时间、跨域处理、proxy代理、根目录读取html、静态资源服务、错误处理等

11. 启动服务

8. 返回`server`给外部使用




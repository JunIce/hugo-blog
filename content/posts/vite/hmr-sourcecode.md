---
title: "vite hmr热更新sourcecode"
date: 2022-06-07T21:29:04+08:00
tags: ["hmr"]
categories: ["vite"]
draft: false
---





# vite hmr热更新源码



vite中在文件发生改动时，server端会监听文件的变化，当文件发生变化会通知客户端重新发起请求，重新渲染页面





## 源码位置



>   "version": "3.0.0-alpha.9"



`packages/vite/src/node/server/hmr.ts`





## handleHMRUpdate



热更新主入口函数



### 文件类型判断



**判断更新的文件类型是什么文件，如果是配置文件就会重新启动服务**

```js
	const shortFile = getShortName(file, config.root)
  const fileName = path.basename(file)

  const isConfig = file === config.configFile
  const isConfigDependency = config.configFileDependencies.some(
    (name) => file === name
  )
  const isEnv =
    config.inlineConfig.envFile !== false &&
    (fileName === '.env' || fileName.startsWith('.env.'))
  // 配置文件
  if (isConfig || isConfigDependency || isEnv) {
    // auto restart server
    debugHmr(`[config change] ${colors.dim(shortFile)}`)
    config.logger.info(
      colors.green(
        `${path.relative(process.cwd(), file)} changed, restarting server...`
      ),
      { clear: true, timestamp: true }
    )
    try {
      // 重新启动
      await server.restart()
    } catch (e) {
      config.logger.error(colors.red(e))
    }
    return
  }
```



### 构造上下文



**构造出热更新上下文**

```js
  const hmrContext: HmrContext = {
    file,
    timestamp,
    modules: mods ? [...mods] : [],
    read: () => readModifiedFile(file),
    server
  }
```



**Tips:** 热更新的时候，vite官方之前是直接读取变化的文件，会发生有些时候读取时间过早读不到内容的情况，所以用了一个定时轮训的方式，读取文件变化的时间`modified time`,只要文件修改时间发生变化就返回出文件内容buffer

```js
async function readModifiedFile(file: string): Promise<string> {
  const content = fs.readFileSync(file, 'utf-8')
  if (!content) {
    const mtime = fs.statSync(file).mtimeMs
    await new Promise((r) => {
      let n = 0
      const poll = async () => {
        n++
        const newMtime = fs.statSync(file).mtimeMs
        if (newMtime !== mtime || n > 10) {
          r(0)
        } else {
          setTimeout(poll, 10)
        }
      }
      setTimeout(poll, 10)
    })
    return fs.readFileSync(file, 'utf-8')
  } else {
    return content
  }
}

```



### 响应插件的热更新



这里会进行过滤需要更新的模块，提高更新的效率，避免全量更新



```js
  for (const plugin of config.plugins) {
    if (plugin.handleHotUpdate) {
      const filteredModules = await plugin.handleHotUpdate(hmrContext)
      // 这里会进行过滤需要更新的模块，提高更新的效率，避免全量更新
      if (filteredModules) {
        hmrContext.modules = filteredModules
      }
    }
  }
```



如果文件是html，直接走全量更新

```js
 if (file.endsWith('.html')) {
    config.logger.info(colors.green(`page reload `) + colors.dim(shortFile), {
      clear: true,
      timestamp: true
    })
    ws.send({
      type: 'full-reload',
      path: config.server.middlewareMode
        ? '*'
        : '/' + normalizePath(path.relative(config.root, file))
    })
  } 
```



最后走到`updateModules`



## updateModules



对模块进行遍历

- 校验模块的有效性
- 每个模块进行更新边界整理，就是走propagateUpdate方法
- 整体搜集放入到updates数组中，最后通过websocket返回给前端



```typescript
	const updates: Update[] = []
  const invalidatedModules = new Set<ModuleNode>()
  let needFullReload = false

  for (const mod of modules) {
    invalidate(mod, timestamp, invalidatedModules)
    if (needFullReload) {
      continue
    }

    const boundaries = new Set<{
      boundary: ModuleNode
      acceptedVia: ModuleNode
    }>()
    const hasDeadEnd = propagateUpdate(mod, boundaries)
    if (hasDeadEnd) {
      needFullReload = true
      continue
    }

    updates.push(
      ...[...boundaries].map(({ boundary, acceptedVia }) => ({
        type: `${boundary.type}-update` as Update['type'],
        timestamp,
        path: boundary.url,
        acceptedPath: acceptedVia.url
      }))
    )
  }
```



### 通知更新



```js
// 全量更新
if (needFullReload) {
  ws.send({
    type: 'full-reload'
  })
} else {
  // 范围更新
  ws.send({
    type: 'update',
    updates
  })
}
```





## propagateUpdate



> time to update

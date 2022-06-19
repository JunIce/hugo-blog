---
title: "vite Client客户端源码"
date: 2022-06-16T07:33:07+08:00
tags: ["vite", "client"]
categories: ["vite"]
draft: false
---



# vite Client客户端源码



vite 客户端使用来响应服务端文件改动， 最终客户端的代码通过注入的方向，注入到index.html中，实现热更新功能



首先客户端和服务端通信使用的是websocket功能实现双向通信



## 相关WebSocket的源码

```typescript
let socket: WebSocket
try {
  socket = new WebSocket(`${socketProtocol}://${socketHost}`, 'vite-hmr')

  // Listen for messages
  socket.addEventListener('message', async ({ data }) => {
    handleMessage(JSON.parse(data))
  })

  // ping server
  socket.addEventListener('close', async ({ wasClean }) => {
    if (wasClean) return
    console.log(`[vite] server connection lost. polling for restart...`)
    await waitForSuccessfulPing()
    location.reload()
  })
} catch (error) {
  console.error(`[vite] failed to connect to websocket (${error}). `)
}
```



## handleMessage



响应socket信息时，使用一个switch来区分不同类型的消息



包括以下几种

- 连接
- 更新
- 自定义
- 完全更新
- 错误处理



```typescript
async function handleMessage(payload: HMRPayload) {
  switch (payload.type) {
    case 'connected':
      console.debug(`[vite] connected.`)
      // ...
      break
    case 'update':
      // ....
      break
    case 'custom': {
      // ....
      break
    }
    case 'full-reload':
      // ...
      break
    case 'prune':
      // ....
      break
    case 'error': {
      // ...
      break
    }
    default: {
      const check: never = payload
      return check
    }
  }
}
```



### full-reload



完全更新的情况



其实就是调用window.location.reload()方法实现页面刷新



```typescript
if (payload.path && payload.path.endsWith('.html')) {
  // if html file is edited, only reload the page if the browser is
  // currently on that page.
  const pagePath = decodeURI(location.pathname)
  const payloadPath = base + payload.path.slice(1)
  if (
    pagePath === payloadPath ||
    payload.path === '/index.html' ||
    (pagePath.endsWith('/') && pagePath + 'index.html' === payloadPath)
  ) {
    location.reload()
  }
  return
} else {
  location.reload()
}
```





### update



部分更新的情况



- js更新，走queueUpdate
- 其他资源更新，走else



```typescript
payload.updates.forEach((update) => {
  if (update.type === 'js-update') {
    queueUpdate(fetchUpdate(update))
  } else {
    // css-update
    // this is only sent when a css file referenced with <link> is updated
    const { path, timestamp } = update
    const searchUrl = cleanUrl(path)
    // can't use querySelector with `[href*=]` here since the link may be
    // using relative paths so we need to use link.href to grab the full
    // URL for the include check.
    const el = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link')
    ).find((e) => cleanUrl(e.href).includes(searchUrl))
    if (el) {
      const newPath = `${base}${searchUrl.slice(1)}${
        searchUrl.includes('?') ? '&' : '?'
      }t=${timestamp}`

      // rather than swapping the href on the existing tag, we will
      // create a new link tag. Once the new stylesheet has loaded we
      // will remove the existing link tag. This removes a Flash Of
      // Unstyled Content that can occur when swapping out the tag href
      // directly, as the new stylesheet has not yet been loaded.
      const newLinkTag = el.cloneNode() as HTMLLinkElement
      newLinkTag.href = new URL(newPath, el.href).href
      const removeOldEl = () => el.remove()
      newLinkTag.addEventListener('load', removeOldEl)
      newLinkTag.addEventListener('error', removeOldEl)
      el.after(newLinkTag)
    }
    console.log(`[vite] css hot updated: ${searchUrl}`)
  }
})
```

其他资源更新的情况

- 第一步，拿到所有的link元素，匹配出对应的元素
- 第二步，对旧资源进行克隆，在加载到新资源的时候，再去删除旧的连接，保证页面的稳定





### queueUpdate



按队列更新信息



```typescript
async function queueUpdate(p: Promise<(() => void) | undefined>) {
  queued.push(p)
  if (!pending) {
    pending = true
    await Promise.resolve()
    pending = false
    const loading = [...queued]
    queued = []
    ;(await Promise.all(loading)).forEach((fn) => fn && fn())
  }
}
```

队列更新放到下一次微任务执行完毕后，通过promise.all方法清空队列数据



### fetchUpdate



获取更新数据



```typescript
async function fetchUpdate({ path, acceptedPath, timestamp }: Update) {
  // 获取热更新模块
  const mod = hotModulesMap.get(path)
  // 不存在，则推出
  if (!mod) {
    // In a code-splitting project,
    // it is common that the hot-updating module is not loaded yet.
    // https://github.com/vitejs/vite/issues/721
    return
  }

  // 模块容器
  const moduleMap = new Map()
  const isSelfUpdate = path === acceptedPath

  // make sure we only import each dep once
  const modulesToUpdate = new Set<string>()
  if (isSelfUpdate) {
    // self update - only update self
    // 自身更新
    modulesToUpdate.add(path)
  } else {
    // dep update
    // 更新依赖
    for (const { deps } of mod.callbacks) {
      // 循环更新依赖
      deps.forEach((dep) => {
        if (acceptedPath === dep) {
          modulesToUpdate.add(dep)
        }
      })
    }
  }

  // determine the qualified callbacks before we re-import the modules
  const qualifiedCallbacks = mod.callbacks.filter(({ deps }) => {
    return deps.some((dep) => modulesToUpdate.has(dep))
  })

  // promise.all 更新数据
  await Promise.all(
    Array.from(modulesToUpdate).map(async (dep) => {
      const disposer = disposeMap.get(dep)
      if (disposer) await disposer(dataMap.get(dep))
      const [path, query] = dep.split(`?`)
      try {
        // 获取新的模块数据
        const newMod = await import(
          /* @vite-ignore */
          base +
            path.slice(1) +
            `?import&t=${timestamp}${query ? `&${query}` : ''}`
        )
        // 添加到模块容器中
        moduleMap.set(dep, newMod)
      } catch (e) {
        warnFailedFetch(e, dep)
      }
    })
  )

  return () => {
    for (const { deps, fn } of qualifiedCallbacks) {
      fn(deps.map((dep) => moduleMap.get(dep)))
    }
    const loggedPath = isSelfUpdate ? path : `${acceptedPath} via ${path}`
    console.log(`[vite] hot updated: ${loggedPath}`)
  }
}

```


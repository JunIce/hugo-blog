---
title: "Vite Websocket源码"
date: 2022-05-11T11:37:15+08:00
tags: ["vite", "websocket"]
categories: ["vite"]
draft: false
---



# Vite -- websocket相关源码



> 2.9.8



`packages/vite/src/node/server/ws.ts`

## createWebSocketServer



源码通过在函数内实例化ws，返回一个对象函数，充分利用js闭包的属性

```typescript
function createWebSocketServer() {
	// .... source code 
	return {
		on: () => {},
		off: () => {},	
		send: () => {},	
		close: () => {},	
	}
}
```



`WebSocketServerRaw`就是开源社区的`ws`库，也是常用的`websocket`封装库



```typescript
wss = new WebSocketServerRaw(websocketServerOptions)
```



```typescript
wss.on('connection', (socket) => {
    socket.on('message', (raw) => {
          if (!customListeners.size) return
          let parsed: any
          try {
            parsed = JSON.parse(String(raw))
          } catch {}
          if (!parsed || parsed.type !== 'custom' || !parsed.event) return
          const listeners = customListeners.get(parsed.event)
          if (!listeners?.size) return
          const client = getSocketClient(socket)
          listeners.forEach((listener) => listener(parsed.data, client))
    })
    socket.send(JSON.stringify({ type: 'connected' }))
})
```



连接成功后，监听socket的`message`事件，并且发送了一个`connected`标识符

监听事件内部，从`customListeners`获取到对应的事件数组，事件是分类存放的，最终存放在一个`map`中



```typescript
  const customListeners = new Map<string, Set<WebSocketCustomListener<any>>>()
  const clientsMap = new WeakMap<WebSocketRaw, WebSocketClient>()
```



## return



### on

暴露到外部的方法，用作添加ws的监听函数

- 原生事件：直接添加监听

- 非原生事件： map中不存在对应事件时，添加一个对应的对象，并且添加到Set中去

```typescript
if (wsServerEvents.includes(event)) wss.on(event, fn)
else {
    if (!customListeners.has(event)) {
      customListeners.set(event, new Set())
    }
    customListeners.get(event)!.add(fn)
}
```





### off

- 原生事件： 直接解除监听
- 非原生事件： 删除对应`Set`中的事件

```typescript
if (wsServerEvents.includes(event)) {
        wss.off(event, fn)
} else {
	customListeners.get(event)?.delete(fn)
}
```



### send



对发送的数据进行格式化处理，数据包装成一个固定格式

拿到所有的客户端实例，遍历发送



```typescript
let payload: HMRPayload
if (typeof args[0] === 'string') {
    payload = {
      type: 'custom',
      event: args[0],
      data: args[1]
    }
} else {
    payload = args[0]
}

if (payload.type === 'error' && !wss.clients.size) {
    bufferedError = payload
    return
}

const stringified = JSON.stringify(payload)
wss.clients.forEach((client) => {
    // readyState 1 means the connection is open
    if (client.readyState === 1) {
      client.send(stringified)
    }
})
```



### close



关闭的时间遍历循环，执行`terminate`方法

```typescript
return new Promise((resolve, reject) => {
    wss.clients.forEach((client) => {
      client.terminate()
    })
    wss.close((err) => {
        if (err) {
        	reject(err)
        } else {
        if (httpsServer) {
          	httpsServer.close((err) => {
                if (err) {
                  reject(err)
                } else {
                  resolve()
                }
             })
        } else {
          resolve()
        }
       }
    })
})
```


---
title: "vite 中websocket使用"
date: 2022-06-07T10:16:19+08:00
tags: ["websocket"]
categories: ["vite"]
draft: false
---



# vite 中有关 websocket 的使用





## 封装



项目是基于第三方`npm`包` ws`, 这个包是为服务端使用websocket而设计的，并不适用浏览器中，项目地址 https://github.com/websockets/ws





## 项目中文件路径



>   "version": "3.0.0-alpha.9"





`packages/vite/src/node/server/ws.ts`



## 源码



源码中有三个比较重要的变量

```typescript
  let wss: WebSocketServerRaw
  
  const customListeners = new Map<string, Set<WebSocketCustomListener<any>>>()
  const clientsMap = new WeakMap<WebSocketRaw, WebSocketClient>()
```





`wss`：websocket的实例对象

`customListeners`: 一个map类型，保存了类型所对对应的变量数据结构，其中`WebSocketCustomListener`也是一个对象



```typescript
export type WebSocketCustomListener<T> = (
  data: T,
  client: WebSocketClient
) => void
```



`clientsMap`:  客户类型所对于的weakMap类型，保存的是连接实例对应的对象，





### 连接部分和消息处理部分的源码

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
    if (bufferedError) {
      socket.send(JSON.stringify(bufferedError))
      bufferedError = null
    }
  })
```

1. 连接成功后会发送一个`connected`事件

   ```typescript
   socket.send(JSON.stringify({ type: 'connected' }))
   ```

2. 消息处理部分会先把字符串反序列化，上下文中可以看出对象有一个type属性和data属性

   

3. 从`customListeners`中取出对应的type所对存储的事件集合

4. `getSocketClient`对于即将发送的数据进行包装成特定格式，并且存入到`clientsMap`中

```typescript
function getSocketClient(socket: WebSocketRaw) {
    if (!clientsMap.has(socket)) {
      clientsMap.set(socket, {
        send: (...args) => {
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
          socket.send(JSON.stringify(payload))
        },
        socket
      })
    }
    return clientsMap.get(socket)!
  }
```

	5. 对事件集合进行遍历执行

```typescript
listeners.forEach((listener) => listener(parsed.data, client))
```





### 错误处理部分的源码

```typescript

  wss.on('error', (e: Error & { code: string }) => {
    if (e.code === 'EADDRINUSE') {
      config.logger.error(
        colors.red(`WebSocket server error: Port is already in use`),
        { error: e }
      )
    } else {
      config.logger.error(
        colors.red(`WebSocket server error:\n${e.stack || e.message}`),
        { error: e }
      )
    }
  })
```





### 函数返回



函数最终返回一个对象，包括事件的注册、解除、发送对于的数据、连接关闭、获取所有的连接等等



#### 注册

其实就是向`customListeners`中存入对应事件的Set

```typescript
{
  on: ((event: string, fn: () => void) => {
      if (wsServerEvents.includes(event)) wss.on(event, fn)
      else {
        if (!customListeners.has(event)) {
          customListeners.set(event, new Set())
        }
        customListeners.get(event)!.add(fn)
      }
    })
}
```



#### 解除



找到对应事件并且删除

```typescript
    off: ((event: string, fn: () => void) => {
      if (wsServerEvents.includes(event)) {
        wss.off(event, fn)
      } else {
        customListeners.get(event)?.delete(fn)
      }
    }) as WebSocketServer['off'],
```



#### 获取所有的客户端连接实例



把websocket实例上所有的客户端连接进行去重，并且查看是否储存在clientsMap中



```typescript
 get clients() {
      return new Set(Array.from(wss.clients).map(getSocketClient))
 },
```



#### 发送



对于传入的参数进行判断，以特点的格式进行发送，拿客户端连接实例的数组并遍历，最终把数据广播发送出去



```typescript
  send(...args: any[]) {
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
    },
```



#### 关闭



遍历客户端数组并关闭，并返回一个promise对象



```
  close() {
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
    }
```


---
title: "vite -- 从0阅读vite之1"
date: 2022-06-11T14:29:21+08:00
tags: ["vite", "plugin"]
categories: ["vite"]
draft: false
---



# 从0阅读vite





## commit1



vite项目的第一个提交，只有6个文件有代码，真实代码不会超过1000行，所以说真的是又个好的想法，尽管去实现，即使一开始很糟

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a7c519821d4414ea3f480ba4388f8ff~tplv-k3u1fbpfcp-watermark.image?)



从`server.js`入手



第一步就是使用http创建了一个nodejs server，同时解析请求的url

- `__hmrProxy`结尾，即走sendJS
- 以`.vue`结尾，则走vue方法
- 否则走serve方法



同时监听在3000端口

```js
const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname
  if (pathname === '/__hmrProxy') {
    sendJS(res, hmrProxy)
  } else if (pathname.endsWith('.vue')) {
    vue(req, res)
  } else {
    serve(req, res)
  }
})
// .....

server.listen(3000, () => {
  console.log('Running at http://localhost:3000')
})
```



通过ws库创建了一个websocket实例，并且在链接的时候记录下链接的socket

```js
const wss = new ws.Server({ server })
const sockets = new Set()
wss.on('connection', (socket) => {
  sockets.add(socket)
  socket.send(JSON.stringify({ type: 'connected'}))
  socket.on('close', () => {
    sockets.delete(socket)
  })
})
```

createFileWatcher执行，遍历sockets, 可以推测出就是发送消息

```js
createFileWatcher((payload) =>
  sockets.forEach((s) => s.send(JSON.stringify(payload)))
)
```





### sendJS

不过时对 http的response 进行了封装，写入了

```js

function send(res, source, mime) {
  res.setHeader('Content-Type', mime)
  res.end(source)
}

function sendJS(res, source) {
  send(res, source, 'application/javascript')
}

```



### vue



走`vueMiddleware.js`



通过解析请求路径中的文件名，再调用parseSFC读取文件名，最终返回descriptor

```js
const parsed = url.parse(req.url, true)
const query = parsed.query
const filename = path.join(process.cwd(), parsed.pathname.slice(1))
const [descriptor] = parseSFC(filename)
```



descriptor包括script、template、style，这不是正好是vue模版文件的三个属性吗，可以推断出是使用`@vue/compiler-sfc'`去解析的

```js
if (descriptor.script) {
  code += descriptor.script.content.replace(
    `export default`,
    'const script ='
  )
  code += `\nexport default script`
}
if (descriptor.template) {
  code += `\nimport { render } from ${JSON.stringify(
    parsed.pathname + `?type=template${query.t ? `&t=${query.t}` : ``}`
  )}`
  code += `\nscript.render = render`
}
if (descriptor.style) {
  // TODO
}
code += `\nscript.__hmrId = ${JSON.stringify(parsed.pathname)}`
return sendJS(res, code)
```



其中对于script、template 都进行了赋值组装代码



### fileWatcher



通过使用第三方库chokidar监听文件的变化，如果文件发生变化，即重新走parseSFC，最后会比对， script的内容或者template的内容发生变化时，会调用notify通知

```js
const fileWatcher = chokidar.watch(process.cwd(), {
    ignored: [/node_modules/]
  })

  fileWatcher.on('change', (file) => {
    if (file.endsWith('.vue')) {
      // check which part of the file changed
      const [descriptor, prevDescriptor] = parseSFC(file)
      const resourcePath = '/' + path.relative(process.cwd(), file)

      if (!prevDescriptor) {
        // the file has never been accessed yet
        return
      }

      if (
        (descriptor.script && descriptor.script.content) !==
        (prevDescriptor.script && prevDescriptor.script.content)
      ) {
        console.log(`[hmr] <script> for ${resourcePath} changed. Triggering component reload.`)
        notify({
          type: 'reload',
          path: resourcePath
        })
        return
      }

      if (
        (descriptor.template && descriptor.template.content) !==
        (prevDescriptor.template && prevDescriptor.template.content)
      ) {
        console.log(`[hmr] <template> for ${resourcePath} changed. Triggering component re-render.`)
        notify({
          type: 'rerender',
          path: resourcePath
        })
        return
      }

      // TODO styles
    } else {
      console.log(`[hmr] script file ${resourcePath} changed. Triggering full page reload.`)
      notify({
        type: 'full-reload'
      })
    }
  })
```

